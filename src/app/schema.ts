import { z } from "zod";
import { DEPARTMENTS } from "@/lib/constants";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileSchema =
  typeof window === 'undefined'
    ? z.any()
    : z.instanceof(File, { message: 'Resume is required.' });


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
    departmentJustification: z
      .string()
      .min(1, "Please answer this question."),
    skillsAndExperience: z.string().min(1, "Please answer this question."),
    portfolioLink: z.string().url("Invalid URL.").optional().or(z.literal("")),
    resume: fileSchema
      .optional()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: `Max file size is 5MB.`,
      })
      .refine(
        (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
        "Only .pdf, .doc, and .docx formats are supported."
      ),
    bonusEssay1: z.string().optional(),
    bonusEssay2: z.string().optional(),
  })
  .refine((data) => data.primaryPreference !== data.secondaryPreference, {
    message: "Primary and secondary preferences cannot be the same.",
    path: ["secondaryPreference"],
  });

export type ApplicationData = z.infer<typeof applicationSchema>;
