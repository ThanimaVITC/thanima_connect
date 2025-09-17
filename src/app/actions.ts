"use server";

import { applicationSchema } from "@/app/schema";
import clientPromise from "@/lib/mongodb";

export async function submitApplication(data: unknown) {
  try {
    const parsedData = applicationSchema.safeParse(data);

    if (!parsedData.success) {
      console.error("Validation Error:", parsedData.error.flatten());
      return { success: false, error: "Invalid data provided." };
    }
    
    // The resume is now available in `parsedData.data.resume`.
    // In a real application, you would upload it to a file storage service
    // like Firebase Storage here and save the URL to the database.
    // For now, we will just exclude it from the database object.
    const { resume, ...dbData } = parsedData.data;
    
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("submissions");
    const result = await collection.insertOne(dbData);

    if (!result.insertedId) {
      return { success: false, error: "Failed to save the application." };
    }

    console.log("New application received and saved:", dbData);
    if (resume) {
      console.log(`Resume received: ${resume.name}, size: ${resume.size} bytes`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
