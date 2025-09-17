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
    
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("submissions");
    await collection.insertOne(parsedData.data);


    console.log("New application received and saved:", parsedData.data);

    return { success: true, data: parsedData.data };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
