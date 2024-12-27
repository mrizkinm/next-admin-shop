import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { UploadIcon, XIcon } from 'lucide-react';

const FileInput = ({ name }) => {
  const { setValue, watch } = useFormContext();
  const files = watch(name);

  const MAX_FILES = 5;

  const onDrop = useCallback(
    (acceptedFiles) => {
      const currentFiles = files || [];

      // Validasi hanya file gambar
      const validFiles = acceptedFiles.filter((file) =>
        file.type.startsWith('image/')
      );

      // Jika ada file non-gambar, tampilkan pesan peringatan
      if (validFiles.length !== acceptedFiles.length) {
        toast.error('Only image files are allowed.');
      }

      // Validasi jumlah file
      const totalFiles = currentFiles.length + validFiles.length;
      if (totalFiles > MAX_FILES) {
        toast.error(`You can only upload up to ${MAX_FILES} files.`);
        return;
      }

      setValue(name, [...currentFiles, ...validFiles], { shouldValidate: true });
    },
    [setValue, files, name]
  );

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      {/* Dropzone Box */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 rounded-md cursor-pointer ${
          isDragActive ? 'border-green-500' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="rounded-full border border-dashed p-3">
                <UploadIcon
                  className="size-7 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="font-medium text-muted-foreground">
                Drop the files here
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="rounded-full border border-dashed p-3">
                <UploadIcon
                  className="size-7 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-px text-center">
                <p className="font-medium text-muted-foreground">
                  Drop files here, or click to select files
                </p>
                <p className="text-sm text-muted-foreground/70">
                  You can upload {MAX_FILES} files max
                </p>
              </div>
            </div>
          )}
        </p>
      </div>

      {/* Daftar Gambar */}
      {files && files.length > 0 && (
        <div className="mt-4">
          <ul className="flex flex-col gap-4">
            {files.map((file, index) => (
              <li
                key={file.name}
                className="flex items-center justify-between bg-gray-50 dark:bg-black p-2 rounded-md"
              >
                <div className="flex items-center">
                  {/* Pratinjau Gambar */}
                  {file.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  {/* Nama File */}
                  <span className="ml-4 text-sm text-secondary-foreground truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
                {/* Tombol Hapus */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => removeFile(index)}
                >
                  <XIcon className="size-4 " aria-hidden="true" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileInput;