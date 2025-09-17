import { z } from "zod";
import { DEPARTMENTS } from "@/lib/constants";

export const applicationSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    regNo: z
      .string()
      .regex(
        /^[1-9][0-9][A-Z]{3}[0-9]{4}$/,
        "Invalid registration number format (e.g., 24BYB1234)."
      ),
    branchAndYear: z
      .string()
      .min(1, "Please specify your branch and year of study."),
    email: z.string().email("Invalid email address."),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits.")
      .regex(
        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        "Invalid phone number format."
      ),
    previousExperience: z.string().optional(),
    primaryPreference: z.enum(DEPARTMENTS, {
      errorMap: () => ({ message: "Please select a primary department." }),
    }),
    secondaryPreference: z.enum(DEPARTMENTS, {
      errorMap: () => ({ message: "Please select a secondary department." }),
    }),
    essay1: z.string().optional(),
    essay2: z.string().optional(),
    portfolioLink: z.string().url("Invalid URL.").optional().or(z.literal("")),
  })
  .refine((data) => data.primaryPreference !== data.secondaryPreference, {
    message: "Primary and secondary preferences cannot be the same.",
    path: ["secondaryPreference"],
  });

export type ApplicationData = z.infer<typeof applicationSchema>;
