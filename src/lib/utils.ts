import { AxiosError } from 'axios';
import '@google/model-viewer';
import { $renderer } from '@google/model-viewer/lib/model-viewer-base';
import { storageUrl, thumbnailDimensions } from './constants';
import { MemberType } from '@/types/Other';

export const atLeastOneLowerCaseOneUpperCaseOneDigitRegex = new RegExp(
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/
);

export const isObject = (anything: any) => {
  return typeof anything === 'object' && !Array.isArray(anything) && anything !== null;
};

export const getErrorMessageFromResponse = (err: any) => {
  let error = 'Unknown error occurred';

  if (err instanceof AxiosError) {
    if (err.response?.status === 401) {
      error = 'Unauthorized';
    } else if (err.response?.data) {
      const { errors, message } = err.response.data;

      if (errors) {
        const firstErrorKey =
          errors && isObject(errors) && Object.keys(errors) && Object.keys(errors)[0];
        if (firstErrorKey) {
          const errorsArray = errors[firstErrorKey];
          if (Array.isArray(errorsArray) && errorsArray[0]) {
            error = errorsArray[0];
          }
        } else if (typeof errors === 'string') {
          error = err.response?.data.errors;
        }
      } else if (message) {
        error = message;
      }
    }
  } else if (err instanceof Error && err.message) {
    error = err.message;
  }

  return error;
};

export const getErrorFromResponse = (err: any) => {
  const error: {
    status: number | null;
    message: string;
  } = {
    status: null,
    message: 'Unknown error occurred',
  };

  if (err instanceof AxiosError) {
    error.status = err.response?.status || null;
    const errors = err.response?.data.errors;

    if (err.response?.status === 401) {
      error.message = 'Unauthorized';
    } else if (errors) {
      const firstErrorKey = isObject(errors) && Object.keys(errors) && Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorsArray = errors[firstErrorKey];
        if (Array.isArray(errorsArray) && errorsArray[0]) {
          error.message = errorsArray[0];
        }
      } else if (typeof errors === 'string') {
        error.message = err.response?.data.errors;
      }
    } else if (err.response?.data.message) {
      error.message = err.response.data.message;
    }
  } else if (err instanceof Error && err.message) {
    error.message = err.message;
  }

  return error;
};

export const getFilenameWithoutExtension = (filename: string) => {
  const parts = filename.split('.');

  if (parts.length === 1) {
    return filename;
  }

  parts.pop();
  return parts.join('.');
};

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase();
};

export const isFileSizeGreaterThanMax = (fileSize: number, maxSizeMB: number) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize > maxSizeBytes;
};

export const generateModelThumbnail = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const modelViewer = document.createElement('model-viewer');
    modelViewer.src = URL.createObjectURL(file);
    modelViewer.style.visibility = 'hidden';
    const size = thumbnailDimensions / window.devicePixelRatio;
    modelViewer.style.width = `${size}px`;
    modelViewer.style.height = `${size}px`;
    modelViewer.style.position = 'fixed';
    modelViewer.style.zIndex = '-1';
    modelViewer.style.top = '0';
    modelViewer.style.left = '0';
    modelViewer[$renderer].minScale = 1;

    modelViewer.addEventListener(
      'load',
      async () => {
        try {
          const blob = await modelViewer.toBlob({ mimeType: 'image/png' });
          const filename = getFilenameWithoutExtension(file.name);
          const thumbnail = new File([blob], `${filename}-thumbnail.png`, { type: 'image/png' });
          resolve(thumbnail);
        } catch (error) {
          reject(error);
        } finally {
          if (modelViewer.src) {
            URL.revokeObjectURL(modelViewer.src);
          }
          document.body.removeChild(modelViewer);
        }
      },
      { once: true }
    );
    document.body.appendChild(modelViewer);
  });
};

export const generateVideoThumbnail = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.style.display = 'none';

    video.addEventListener(
      'loadeddata',
      () => {
        video.currentTime = 0;
      },
      { once: true }
    );

    video.addEventListener(
      'seeked',
      () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if (!context) {
          reject(new Error('Failed to get canvas context'));
          URL.revokeObjectURL(video.src);
          document.body.removeChild(video);
          return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const filename = getFilenameWithoutExtension(file.name);
            const thumbnail = new File([blob], `${filename}-thumbnail.jpg`, { type: 'image/jpeg' });
            resolve(thumbnail);
          } else {
            reject(new Error('Failed to generate video thumbnail'));
          }
          URL.revokeObjectURL(video.src);
          document.body.removeChild(video);
        }, 'image/jpeg');
      },
      { once: true }
    );

    video.addEventListener(
      'error',
      () => {
        reject(new Error('Failed to load video'));
        URL.revokeObjectURL(video.src);
        document.body.removeChild(video);
      },
      { once: true }
    );

    document.body.appendChild(video);
  });
};

export const getStorageUrl = (url: string | null | undefined) => {
  if (!url) {
    return '';
  }

  if (import.meta.env.DEV) {
    return `/storage/${url}`;
  }

  return `${storageUrl}/${url}`;
};

export const stringToColor = (str: string) => {
  if (!str) str = 'default';

  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }
  return color;
};

export const parseCommaSeparatedEmails = (emails: string) => {
  return [
    ...new Set(
      emails
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean)
    ),
  ];
};

/**
 *
 * @param currentUserId
 * @param list
 * @returns list of users in a human-readable format (e.g. "You, Marko, Ivana and 3 others")
 */
export const parseUserList = (
  currentUserId: string | undefined,
  list: { userId: string; name: string | null }[]
) => {
  const shortList = list.slice(0, 4);
  const shortListLength = shortList.length;
  const listTotalLength = list.length;

  return shortList.reduce((prev, curr, index) => {
    const text = curr.userId === currentUserId ? 'You' : curr.name?.split(' ')[0] || 'Unknown';
    const isLast = index === shortListLength - 1;
    const isSecondLast = index === shortListLength - 2;

    if (isSecondLast) {
      return `${prev}${text}${shortListLength === listTotalLength ? ' and ' : ''}`;
    }
    if (isLast) {
      // is last and no others
      if (shortListLength === listTotalLength) {
        return `${prev}${text}`;
      } else {
        // is last and x others
        return `${prev}, ${text} and ${listTotalLength - shortListLength} ${listTotalLength - shortListLength === 1 ? 'other' : 'others'}`;
      }
    }

    return `${prev}${text}, `;
  }, '');
};

/**
 *
 * @param list
 * @returns list of users and teams in a human-readable format (e.g. "You, Marko, Blue Team and 3 others")
 */
export const parseUserAndTeamList = (
  list: { isCurrentUserOrTeam: boolean; id: string; name: string | null; type: MemberType }[]
) => {
  const shortList = list.slice(0, 4);
  const shortListLength = shortList.length;
  const listTotalLength = list.length;

  return shortList.reduce((prev, curr, index) => {
    const text =
      curr.type === MemberType.TEAM
        ? curr.isCurrentUserOrTeam
          ? 'this team'
          : curr.name
        : curr.isCurrentUserOrTeam
          ? 'You'
          : curr.name?.split(' ')[0];

    const isLast = index === shortListLength - 1;
    const isSecondLast = index === shortListLength - 2;

    if (isSecondLast) {
      return `${prev}${text}${shortListLength === listTotalLength ? ' and ' : ''}`;
    }
    if (isLast) {
      // is last and no others
      if (shortListLength === listTotalLength) {
        return `${prev}${text}`;
      } else {
        // is last and x others
        return `${prev}, ${text} and ${listTotalLength - shortListLength} ${listTotalLength - shortListLength === 1 ? 'other' : 'others'}`;
      }
    }

    return `${prev}${text}, `;
  }, '');
};

export const getUserDisplayName = (
  user:
    | {
        firstName: string | null;
        lastName: string | null;
        userAlias: string | null;
        email: string;
      }
    | null
    | undefined
) => {
  if (!user) return '';

  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.userAlias?.trim() || user.email;
};

export const formatDateAsMonthDate = (date: string) => {
  const jsDate = new Date(date);
  const currentYear = new Date().getFullYear();
  const year = jsDate.getFullYear();
  const month = jsDate.toLocaleString('default', { month: 'long' });

  if (year === currentYear) {
    return `${month} ${jsDate.getDate()}`;
  }

  return `${month} ${jsDate.getDate()}, ${year}`;
};
