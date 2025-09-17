'use server';

import clientPromise from '@/lib/mongodb';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Writable } from 'stream';
import { ApplicationData } from '@/app/schema';
import JSZip from 'jszip';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function verifyAuth() {
  try {
    const cookieStore = cookies();
    if (cookieStore.get('admin-auth')?.value !== 'true') {
      redirect('/admin');
    }
  } catch (error) {
    redirect('/admin');
  }
}

export async function getSubmissions(): Promise<ApplicationData[]> {
  await verifyAuth();
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const submissions = await db.collection('submissions').find({}).toArray();

    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportSubmissionsAsCsv(): Promise<{
  content: string;
  error?: string;
}> {
  await verifyAuth();
  try {
    const submissions = await getSubmissions();
    if (submissions.length === 0) {
      return { content: '' };
    }

    const headers = Object.keys(submissions[0]);
    const headerRow = headers.map(escapeCsvValue).join(',');

    const dataRows = submissions.map((submission) => {
      return headers
        .map((header) =>
          escapeCsvValue((submission as any)[header])
        )
        .join(',');
    });

    const csvContent = [headerRow, ...dataRows].join('\n');
    return { content: csvContent };
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return { content: '', error: 'Failed to export data.' };
  }
}

async function streamToBuffer(stream: Writable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function downloadAllFiles(): Promise<{
  content: string;
  error?: string;
}> {
  await verifyAuth();
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const submissions = await db.collection('submissions').find({ resumeFileId: { $ne: null } }).toArray();

    if (submissions.length === 0) {
      return { content: '', error: "No files to download." };
    }

    const bucket = new GridFSBucket(db, { bucketName: 'resumes' });
    const zip = new JSZip();

    for (const submission of submissions) {
      if (submission.resumeFileId) {
        try {
          const fileId = new ObjectId(submission.resumeFileId);
          const files = await bucket.find({ _id: fileId }).toArray();
          if (files.length === 0) {
            console.error(`File not found in GridFS for submission ${submission.regNo}`);
            continue;
          }
          const fileInfo = files[0];
          const downloadStream = bucket.openDownloadStream(fileId);
          
          const chunks: Buffer[] = [];
          for await (const chunk of downloadStream) {
            chunks.push(chunk);
          }
          const buffer = Buffer.concat(chunks);
          
          zip.file(fileInfo.filename, buffer);
        } catch (fileError) {
          console.error(`Failed to process file for ${submission.regNo}:`, fileError);
        }
      }
    }

    const zipContent = await zip.generateAsync({ type: 'base64' });
    return { content: zipContent };
  } catch (error) {
    console.error('Error creating zip file:', error);
    return { content: '', error: 'Failed to create zip file.' };
  }
}
