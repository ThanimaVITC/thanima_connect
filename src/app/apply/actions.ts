'use server';

import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  try {
    const blob = await put(`${nanoid()}-${file.name}`, file, {
      access: 'public',
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file.' };
  }
}
