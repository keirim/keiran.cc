import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { rateLimit } from '@/middleware/rateLimit';

const prisma = new PrismaClient();

const pasteSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  content: z.string().min(1).max(100000),
  language: z.string().max(50),
  expirationTime: z.string().optional(),
  domain: z.string().min(1).optional(),
});

/**
 * Handles POST requests to the /api/pastes endpoint.
 *
 * The request should contain a JSON body with the following properties:
 *
 * - `title`: The title of the paste.
 * - `description`: The description of the paste. Optional.
 * - `content`: The content of the paste.
 * - `language`: The language of the paste.
 * - `expirationTime`: The expiration time of the paste. Optional.
 * - `domain`: The domain to use for the paste URL. Optional.
 *
 * If the request is invalid, or if an error occurs while processing the
 * request, the response will contain a JSON object with an "error" property
 * that describes the error. The HTTP status code of the response will be
 * 400 or 500, depending on the type of error.
 *
 * If the request is successful, the response will contain a JSON object with
 * a single property, `url`, which is the URL of the created paste.
 */
export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await request.json();
    const { title, description, content, language, expirationTime, domain } =
      pasteSchema.parse(body);

    const sanitizedContent = DOMPurify.sanitize(content);

    const pasteId = nanoid(10);
    const maxExpirationTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const defaultExpirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    let expiration = new Date(Date.now() + defaultExpirationTime);
    if (expirationTime) {
      const customExpiration = new Date(expirationTime).getTime();
      if (!isNaN(customExpiration)) {
        if (customExpiration > Date.now() + maxExpirationTime) {
          expiration = new Date(Date.now() + maxExpirationTime);
        } else {
          expiration = new Date(customExpiration);
        }
      }
    }

    const paste = await prisma.paste.create({
      data: {
        id: pasteId,
        title,
        description,
        content: sanitizedContent,
        language,
        expiresAt: expiration,
      },
    });

    const returnDomain = domain || 'keiran.cc';
    const pasteUrl = `https://${returnDomain}/p/${paste.id}`;

    return NextResponse.json({ url: pasteUrl });
  } catch (error) {
    console.error('Error creating paste:', error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 },
      );
    }
    if (error instanceof Error) {
      console.error('Detailed error:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
