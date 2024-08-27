import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ModalWithShape from '@/components/modals/variants/ModalWithShape';
import ImportOptionButton from '@/components/buttons/ImportOptionButton';
import TechnologyIcon from '@icons/Technology.svg?react';
import VideoIcon from '@icons/Video.svg?react';
import ImageIcon from '@icons/Image.svg?react';
import { uploadImage, uploadVideo, uploadModel } from '@/api/asset';
import {
  getFilenameWithoutExtension,
  getFileExtension,
  generateModelThumbnail,
  generateVideoThumbnail,
  isFileSizeGreaterThanMax,
} from '@/lib/utils';
import { allowedFiles, maxFileSize } from '@/lib/constants';
import { AxiosProgressEvent } from 'axios';

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  folderId?: string | null;
  teamId?: string;
  onUploadStart: (id: string, name: string) => void;
  onUploadProgress: (id: string, progress: number) => void;
  onUploadComplete: (id: string) => void;
}

export default function ImportModal({
  isOpen,
  onOpenChange,
  onClose,
  folderId,
  teamId = '',
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
}: Props) {
  const queryClient = useQueryClient();

  const [fileType, setFileType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageMutation = useMutation({
    mutationFn: ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress: (event: AxiosProgressEvent) => void;
    }) => uploadImage(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  const uploadVideoMutation = useMutation({
    mutationFn: ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress: (event: AxiosProgressEvent) => void;
    }) => uploadVideo(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  const uploadModelMutation = useMutation({
    mutationFn: ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress: (event: AxiosProgressEvent) => void;
    }) => uploadModel(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  useEffect(() => {
    if (fileInputRef.current && fileType) {
      fileInputRef.current.click();
      setFileType('');
    }
  }, [fileType]);

  const handleImportOptionClick = (type: string) => {
    setFileType(type);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onClose();

      const supportedFiles = files.filter((file) => {
        const fileExtension = getFileExtension(file.name);
        let isSupported;
        if (fileExtension) isSupported = allowedFiles.includes(fileExtension);
        if (!isSupported) toast.warning(`${file.name} rejected. File format is not supported.`);
        return isSupported;
      });

      const totalFiles = supportedFiles.length;

      if (totalFiles === 0) return;

      let successfulUploads = 0;

      const uploadFile = async (file: File) => {
        const fileExtension = getFileExtension(file.name);
        const filename = getFilenameWithoutExtension(file.name);
        const formData = new FormData();
        formData.append('Title', filename);
        formData.append('TeamId', teamId);
        if (folderId) {
          formData.append('FolderId', folderId);
        }

        let uploadFunction;
        const uploadId = `${filename}-${Date.now()}`;

        switch (fileExtension) {
          case 'trce':
            formData.append('Trace', file);
            uploadFunction = uploadModelMutation.mutateAsync;
            break;
          case 'glb':
            const modelThumbnail = await generateModelThumbnail(file);
            formData.append('Model', file);
            formData.append('Thumbnail', modelThumbnail);
            uploadFunction = uploadModelMutation.mutateAsync;
            break;
          case 'mp4':
            const videoThumbnail = await generateVideoThumbnail(file);
            formData.append('Video', file);
            formData.append('Thumbnail', videoThumbnail);
            uploadFunction = uploadVideoMutation.mutateAsync;
            break;
          case 'jpg':
          case 'jpeg':
          case 'png':
            formData.append('Image', file);
            uploadFunction = uploadImageMutation.mutateAsync;
            break;
          default:
            toast.warning(`${file.name} rejected. File format is not supported.`);
            return;
        }

        if (isFileSizeGreaterThanMax(file.size, maxFileSize)) {
          toast.warning(`${file.name} rejected. Maximum file size is ${maxFileSize}MB.`);
          return;
        }

        try {
          onUploadStart(uploadId, filename);
          await uploadFunction({
            formData,
            onUploadProgress: (event: AxiosProgressEvent) => {
              const total = event.total ?? 1;
              const progress = Math.round((event.loaded * 100) / total);
              onUploadProgress(uploadId, progress);
            },
          });
          successfulUploads++;
          if (successfulUploads === totalFiles) {
            toast.success('Files uploaded successfully.');
          }
        } catch (error) {
          console.error(error);
          toast.error(`Failed to upload ${file.name}`);
        } finally {
          onUploadComplete(uploadId);
        }
      };

      for (const file of supportedFiles) {
        uploadFile(file);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getAcceptedFileTypes = () => {
    switch (fileType) {
      case 'images':
        return '.png,.jpg,.jpeg';
      case 'videos':
        return '.mp4';
      case 'models':
        return '.glb';
      default:
        return '';
    }
  };

  return (
    <ModalWithShape
      title="Import"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      baseSlotClassNames={['w-fit', 'max-w-[90vw]']}
      headerSlotClassNames={['text-4xl']}
    >
      <p className="text-xl mb-8">
        Select what you'd like to import or drag and drop it into the screen.
      </p>
      <div className="flex gap-4 mb-14">
        <ImportOptionButton
          text="3D Models"
          secondaryText="GLBs"
          icon={<TechnologyIcon width={32} height={32} />}
          onClick={() => handleImportOptionClick('models')}
        />
        <ImportOptionButton
          text="Images"
          secondaryText="PNGs, JPGs, JPEGs"
          icon={<ImageIcon width={32} height={32} />}
          onClick={() => handleImportOptionClick('images')}
        />
        <ImportOptionButton
          text="Videos"
          secondaryText="MP4s"
          icon={<VideoIcon width={32} height={32} />}
          onClick={() => handleImportOptionClick('videos')}
        />
      </div>
      <input
        type="file"
        accept={getAcceptedFileTypes()}
        multiple
        ref={fileInputRef}
        className="absolute hidden"
        onChange={handleFileChange}
      />
    </ModalWithShape>
  );
}
