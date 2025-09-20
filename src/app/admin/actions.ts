'use server';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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

export async function downloadAllFiles(): Promise<{
  content: string;
  error?: string;
}> {
  await verifyAuth();
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const submissions = await db.collection('submissions').find({ resumeUrl: { $ne: null } }).toArray();

    if (submissions.length === 0) {
      return { content: '', error: "No files to download." };
    }

    const zip = new JSZip();

    for (const submission of submissions) {
      if (submission.resumeUrl) {
        try {
          const response = await fetch(submission.resumeUrl);
          if (!response.ok) {
            console.error(`Failed to fetch file for ${submission.regNo} from ${submission.resumeUrl}`);
            continue;
          }
          const buffer = await response.arrayBuffer();
          const filename = `${submission.name.replace(/\s+/g, '_')}_${submission.regNo}${submission.resumeUrl.substring(submission.resumeUrl.lastIndexOf('.'))}`;
          zip.file(filename, buffer);
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
