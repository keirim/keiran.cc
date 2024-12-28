'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, File, CheckCircle, Link } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import FileUrlDisplay from '@/components/file-url-display';

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB in bytes

export default function FileUpload({
  setToast,
  setUploadedFileUrl,
}: {
  setToast: (message: string, description: string) => void;
  setUploadedFileUrl: (url: string | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localUploadedFileUrl, setLocalUploadedFileUrl] = useState<
    string | null
  >(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  const [buttonLabel, setButtonLabel] = useState('Upload');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (uploadSuccess) {
      handleSparkle();
    }
  }, [uploadSuccess]);

  const handleSparkle = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setToast('File too large', 'Maximum file size is 1GB.');
      } else {
        setFile(selectedFile);
      }
    },
    [setToast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('domain', 'keiran.cc');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setLocalUploadedFileUrl(data.imageUrl);
      setRawUrl(data.rawUrl);
      setUploadedFileUrl(data.imageUrl);
      setUploadSuccess(true);
      setButtonLabel('Uploaded');

      setTimeout(() => {
        resetUploadState();
      }, 1000);
    } catch (error) {
      setToast(
        'Upload failed',
        'There was an error uploading your file. Please try again.',
      );
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const resetUploadState = () => {
    setButtonLabel('Upload');
    setUploadSuccess(false);
  };

  const copyRawLink = () => {
    if (rawUrl) {
      navigator.clipboard.writeText(rawUrl);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl border-none">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center space-x-4">
              <File className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium text-foreground">
                {file.name}
              </span>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-lg mb-2 font-semibold text-foreground">
                Drag & drop a file here, or click to select a file
              </p>
              <p className="text-sm text-muted-foreground">
                Max file size: 1GB
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            variant="ghost"
            className="px-6 py-2 text-lg bg-primary text-primary-foreground"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <div className="flex items-center justify-center space-x-4 text-green-500">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                {buttonLabel}
              </div>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                {buttonLabel}
              </>
            )}
          </Button>
        </div>
        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Uploading...
            </p>
          </div>
        )}
        {localUploadedFileUrl && (
          <div className="mt-6">
            <FileUrlDisplay url={localUploadedFileUrl} />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={copyRawLink}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <Link className="mr-2 h-4 w-4" />
                Copy Raw Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
