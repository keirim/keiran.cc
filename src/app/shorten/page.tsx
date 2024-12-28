'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link, Loader2, Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, {
      message:
        'Custom alias can only contain letters, numbers, hyphens, and underscores',
    })
    .max(12)
    .optional(),
  expirationTime: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Invalid datetime format' },
    )
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ShortenPage() {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, domain: 'keiran.cc' }),
      });

      const result = await response.json();

      if (response.ok) {
        setShortenedUrl(result.shortUrl);
        toast.success('URL shortened successfully');
      } else {
        toast.error('Failed to shorten URL');
      }
    } catch (error) {
      toast.error('An error occurred while shortening URL');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-3xl mx-auto mt-8">
          <CardHeader className="flex justify-between items-center p-6">
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-center text-foreground mt-8">
              Shorten Your URL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label
                  htmlFor="url"
                  className="block text-sm font-medium text-foreground mb-2 ml-1"
                >
                  URL to Shorten
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  {...register('url')}
                  className="mt-1 block w-full"
                />
                {errors.url && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.url.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="customAlias"
                  className="block text-sm font-medium text-foreground mb-2 ml-1"
                >
                  Custom Alias (Optional)
                </Label>
                <Input
                  id="customAlias"
                  type="text"
                  placeholder="my-custom-url"
                  {...register('customAlias')}
                  className="mt-1 block w-full"
                />
                {errors.customAlias && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.customAlias.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="expirationTime"
                  className="block text-sm font-medium text-foreground mb-2 ml-1"
                >
                  Expiration Time (Optional)
                </Label>
                <Input
                  id="expirationTime"
                  type="datetime-local"
                  {...register('expirationTime')}
                  className="mt-1 block w-full"
                />
                <p className="text-sm text-primary/50 mt-1 ml-1">
                  Default: 24 hours, Max: 30 days
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-card-foreground text-card py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>
            </form>
            {shortenedUrl && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label
                  htmlFor="shortenedUrl"
                  className="block text-sm font-medium text-foreground"
                >
                  Shortened URL
                </Label>
                <div className="flex mt-1">
                  <Input
                    id="shortenedUrl"
                    type="text"
                    value={shortenedUrl}
                    readOnly
                    className="flex-grow"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="ml-2"
                          onClick={() => copyToClipboard(shortenedUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
