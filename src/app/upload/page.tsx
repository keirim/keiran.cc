'use client';

import { useState } from 'react';
import FileUpload from '@/components/file-upload';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UploadPage() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const setToast = (message: string, description: string) => {
    toast({ title: message, description });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-center text-foreground mt-8">
            Upload Your Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg md:text-xl text-center text-muted-foreground mb-4">
            Unlimited uploads for free, forever.
          </p>
          <FileUpload
            setToast={setToast}
            setUploadedFileUrl={setUploadedFileUrl}
          />
          {uploadedFileUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            ></motion.div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </motion.div>
  );
}
