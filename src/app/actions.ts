'use server';

import {applicationSchema} from '@/app/schema';
import clientPromise from '@/lib/mongodb';

export async function submitApplication(data: unknown) {
  try {
    const rawData = data as Omit<
      z.infer<typeof applicationSchema>,
      'resume'
    > & {resumeUrl?: string};

    const parsedData = applicationSchema.safeParse(rawData);

    if (!parsedData.success) {
      console.error('Validation Error:', parsedData.error.flatten());
      return {success: false, error: 'Invalid data provided.'};
    }

    const {resume, ...dbData} = parsedData.data;
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);

    const applicationData = {
      ...dbData,
      resumeUrl: rawData.resumeUrl,
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
