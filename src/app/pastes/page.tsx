'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Copy, ExternalLink, Settings, Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(100000, 'Content must be 100,000 characters or less'),
  language: z.string().min(1, 'Language is required'),
  expirationTime: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const languageOptions = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'autohotkey ', label: 'Autohotkey' },
  { value: 'bash', label: 'Bash' },
  { value: 'basic', label: 'Basic' },
  { value: 'birb', label: 'Birb' },
  { value: 'brainfuck', label: 'Brainfuck' },
  { value: 'c', label: 'C' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'cmake', label: 'CMake' },
  { value: 'cobol', label: 'Cobol' },
  { value: 'coffeescript', label: 'Coffeescript' },
  { value: 'cpp', label: 'C++' },
  { value: 'crystal', label: 'Crystal' },
  { value: 'css', label: 'CSS' },
  { value: 'csharp', label: 'C#' },
  { value: 'd', label: 'D' },
  { value: 'dart', label: 'Dart' },
  { value: 'django', label: 'Django' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'elm', label: 'Elm' },
  { value: 'erlang', label: 'Erlang' },
  { value: 'fortran', label: 'Fortran' },
  { value: 'fsharp', label: 'F#' },
  { value: 'gdscript', label: 'GDScript' },
  { value: 'go', label: 'Go' },
  { value: 'html', label: 'HTML' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'json', label: 'JSON' },
  { value: 'jsx', label: 'JSX' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'lua', label: 'Lua' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'nim', label: 'Nim' },
  { value: 'nix', label: 'Nix' },
  { value: 'objective-c', label: 'Objective-C' },
  { value: 'ocaml', label: 'OCaml' },
  { value: 'pascal', label: 'Pascal' },
  { value: 'perl', label: 'Perl' },
  { value: 'php', label: 'PHP' },
  { value: 'python', label: 'Python' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'scala', label: 'Scala' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'toml', label: 'TOML' },
  { value: 'tsx', label: 'TSX' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'v', label: 'V' },
  { value: 'vim', label: 'Vim' },
  { value: 'yaml', label: 'YAML' },
  { value: 'zig', label: 'Zig' },
];

export default function PastePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'plaintext',
    },
  });

  const content = watch('content');
  const language = watch('language');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, domain: 'keiran.cc' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create paste');
      }

      const result = await response.json();
      setPasteUrl(result.url);
      toast('Paste created successfully!');
    } catch (error) {
      toast('Error! An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
              Create a Paste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter a title for your paste"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter an optional description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.language && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="expirationTime">
                  Expiration Time (Optional)
                </Label>
                <Input
                  id="expirationTime"
                  type="datetime-local"
                  {...register('expirationTime')}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Default: 7 days, Max: 30 days
                </p>
              </div>
              <Tabs defaultValue="editor">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <Textarea
                    {...register('content')}
                    placeholder="Enter your code or text here"
                    rows={15}
                    className="font-mono"
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.content.message}
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="preview">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    className="rounded-md"
                    showLineNumbers
                  >
                    {content || '// Your code will be previewed here'}
                  </SyntaxHighlighter>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Paste...
                  </>
                ) : (
                  'Create Paste'
                )}
              </Button>
            </form>
            {pasteUrl && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="pasteUrl">Paste URL</Label>
                <div className="flex mt-1">
                  <Input
                    id="pasteUrl"
                    value={pasteUrl}
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
                          onClick={() => {
                            navigator.clipboard.writeText(pasteUrl);
                            toast.success('Copied to clipboard!');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="ml-2"
                          onClick={() => window.open(pasteUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open in new tab</p>
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
