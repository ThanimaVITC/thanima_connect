"use server";

import { applicationSchema } from "@/app/schema";

export async function submitApplication(data: unknown) {
  try {
    const parsedData = applicationSchema.safeParse(data);

    if (!parsedData.success) {
      console.error("Validation Error:", parsedData.error.flatten());
      return { success: false, error: "Invalid data provided." };
    }

    // In a real application, you would save this data to a database.
    console.log("New application received:", parsedData.data);

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, data: parsedData.data };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
