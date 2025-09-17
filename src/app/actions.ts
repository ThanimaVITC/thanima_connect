'use server';

import {Readable} from 'stream';
import {GridFSBucket} from 'mongodb';
import {applicationSchema} from '@/app/schema';
import clientPromise from '@/lib/mongodb';
import path from 'path';

export async function submitApplication(data: unknown) {
  try {
    const formData = data as FormData;
    const rawData = Object.fromEntries(formData.entries());
    const resumeFile = formData.get('resume');

    const dataToValidate = {
      ...rawData,
      resume:
        resumeFile instanceof File && resumeFile.size > 0
          ? resumeFile
          : undefined,
    };

    const parsedData = applicationSchema.safeParse(dataToValidate);

    if (!parsedData.success) {
      console.error('Validation Error:', parsedData.error.flatten());
      return {success: false, error: 'Invalid data provided.'};
    }

    const {resume, ...dbData} = parsedData.data;
    let resumeFileId: string | null = null;

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);

    if (resume) {
      console.log(
        `Resume received: ${resume.name}, size: ${resume.size} bytes`
      );

      const bucket = new GridFSBucket(db, {bucketName: 'resumes'});
      const arrayBuffer = await resume.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const fileExtension = path.extname(resume.name);
      const filename = `${parsedData.data.name.replace(/\s+/g, '_')}_${parsedData.data.regNo}${fileExtension}`;
      
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: resume.type,
      });

      await new Promise((resolve, reject) => {
        readableStream
          .pipe(uploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });

      resumeFileId = uploadStream.id.toString();
      console.log(`Resume uploaded with file ID: ${resumeFileId}`);
    }

    const applicationData = {
      ...dbData,
      resumeFileId: resumeFileId,
      submittedAt: new Date(),
    };

    const collection = db.collection('submissions');
    const result = await collection.insertOne(applicationData);

    if (!result.insertedId) {
      return {success: false, error: 'Failed to save the application.'};
    }

    console.log('New application received and saved:', applicationData);

    return {success: true};
  } catch (error) {
    console.error('Error submitting application:', error);
    return {success: false, error: 'An unexpected error occurred.'};
  }
}
