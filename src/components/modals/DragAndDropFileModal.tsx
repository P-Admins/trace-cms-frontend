import { useCallback } from 'react';
import { Modal, ModalContent, ModalBody, Image } from '@nextui-org/react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';
import LargeCylinder from '@/assets/shapes/cylinder_large.png';
import Triangular from '@/assets/shapes/triangular_prism.png';
import {
  generateModelThumbnail,
  generateVideoThumbnail,
  getFilenameWithoutExtension,
  getFileExtension,
  isFileSizeGreaterThanMax,
} from '@/lib/utils';
import { uploadImage, uploadVideo, uploadModel, uploadTraceFile } from '@/api/asset';
import { allowedFiles, maxFileSize } from '@/lib/constants';

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  folderName: string;
  folderId?: string;
  teamId?: string;
  onUploadStart: (id: string, name: string) => void;
  onUploadProgress: (id: string, progress: number) => void;
  onUploadComplete: (id: string) => void;
}

export default function DragAndDropFileModal({
  isOpen,
  onOpenChange,
  onClose,
  folderName,
  folderId = '',
  teamId = '',
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
}: Props) {
  const queryClient = useQueryClient();

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

  const uploadTraceFileMutation = useMutation({
    mutationFn: ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress: (event: AxiosProgressEvent) => void;
    }) => uploadTraceFile(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!folderId) return;
      onClose();

      for (const file of rejectedFiles) {
        toast.warning(`${file.file.name} rejected. File format is not supported.`);
      }

      const supportedFiles = acceptedFiles.filter((file) => {
        const fileExtension = getFileExtension(file.name);
        if (fileExtension) return allowedFiles.includes(fileExtension);
      });

      const totalFiles = supportedFiles.length;

      if (totalFiles === 0) return;

      let successfulUploads = 0;

      const uploadFile = async (file: File) => {
        const fileExtension = getFileExtension(file.name);
        const filename = getFilenameWithoutExtension(file.name);
        const formData = new FormData();
        formData.append('TeamId', teamId);
        formData.append('FolderId', folderId);
        formData.append('Title', filename);

        let uploadFunction;
        const uploadId = `${filename}-${Date.now()}`;

        switch (fileExtension) {
          case 'trce':
          case 'trace':
            formData.append('Trace', file);
            uploadFunction = uploadTraceFileMutation.mutateAsync;
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
    },
    [onClose, uploadImageMutation, uploadVideoMutation, uploadModelMutation, teamId, folderId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/zip': ['.trce', '.trace'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4'],
      'model/gltf-binary': ['.glb'],
    },
    onDrop,
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      hideCloseButton
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: '100%',
            opacity: 0,
            transition: {
              duration: 0.3,
              ease: 'easeIn',
            },
          },
        },
      }}
      classNames={{
        base: [
          'rounded-t-[70px]',
          'rounded-b-none',
          'bg-white/80',
          'backdrop-blur-sm',
          'border-white',
          'border-t-[4px]',
          'border-x-[4px]',
          'overflow-y-visible',
          'max-w-full',
          'sm:mx-0 sm:my-0',
          'h-[62vh]',
        ],
        body: ['px-[45px]', 'pt-[38px]', 'pb-0'],
      }}
    >
      <ModalContent>
        <ModalBody>
          <div
            {...getRootProps()}
            className="border-x-2 border-t-2 border-white border-dashed h-full rounded-t-[70px] flex flex-col justify-center items-center overflow-y-clip cursor-pointer"
          >
            <input {...getInputProps()} multiple />
            <div className="text-center relative z-[-1]">
              <p className="text-6xl tracking-wider bg-gradient-main bg-clip-text text-transparent">
                DRAG CONTENT HERE
              </p>
              <p className="text-3xl mt-[18px]">to add to {folderName} folder</p>
              <Image
                src={LargeCylinder}
                width={131}
                height={130}
                classNames={{
                  wrapper: 'absolute bottom-0 left-[-10%] -rotate-90 translate-y-full',
                }}
              />
            </div>
          </div>
          <Image
            src={Triangular}
            width={189}
            height={189}
            classNames={{ wrapper: 'absolute top-[-60px] right-[20%]' }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
