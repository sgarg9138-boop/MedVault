import { z } from "zod";

export const recordUploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  category: z.enum([
    "lab-report",
    "prescription",
    "radiology",
    "discharge",
    "vaccination",
    "other",
  ]),
  doctorName: z.string().min(2, "Doctor name is required"),
  facility: z.string().min(2, "Hospital or Clinic name is required"),
  date: z.string().min(1, "Date of record is required"),
  tags: z.string().optional(),
  summary: z.string().optional(),
});

export type RecordUploadInput = z.infer<typeof recordUploadSchema>;

export const medicationSchema = z.object({
  name: z.string().min(2, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required (e.g. 500mg, 1 tablet)"),
  frequency: z.string().min(1, "Frequency is required (e.g. Once daily)"),
  instructions: z.string().min(2, "Instructions are required (e.g. Take after meal)"),
  prescribedBy: z.string().min(2, "Prescribing doctor is required"),
  timeOfDay: z.array(z.enum(["Morning", "Afternoon", "Evening", "Night"])).min(1, "Select at least one schedule slot"),
});

export type MedicationInput = z.infer<typeof medicationSchema>;

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  zipCode: z.string().min(4, "Valid Postal/ZIP code is required"),
  paymentMethod: z.enum(["card", "cod", "insurance"]),
  prescriptionConfirmed: z.boolean().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const shareLinkSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientRole: z.enum(["Doctor", "Specialist", "Caregiver", "Insurance", "Family"]),
  organization: z.string().min(2, "Hospital or Clinic name is required"),
  accessLevel: z.enum(["Full Vault", "Lab Reports Only", "Single Document"]),
  expiresInDays: z.number().min(1).max(30),
  requirePin: z.boolean(),
  pinCode: z.string().optional(),
});

export type ShareLinkInput = z.infer<typeof shareLinkSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
