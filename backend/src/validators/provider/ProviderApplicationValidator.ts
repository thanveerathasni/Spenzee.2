import { z } from "zod";

export const providerApplicationSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters.")
    .max(100, "Brand name cannot exceed 100 characters."),

  email: z.email("Invalid email address.").trim().toLowerCase(),

  phone: z.string().trim().min(7, "Invalid phone number.").max(20, "Invalid phone number."),

  primaryCategory: z
    .string()
    .trim()
    .min(2, "Primary category is required.")
    .max(100, "Primary category cannot exceed 100 characters."),

  companyName: z.string().trim().max(150, "Company name cannot exceed 150 characters.").optional(),

  websiteUrl: z.url("Invalid website URL.").trim().optional(),

  gstNumber: z.string().trim().max(50, "GST number cannot exceed 50 characters.").optional(),

  licenseNumber: z
    .string()
    .trim()
    .max(50, "License number cannot exceed 50 characters.")
    .optional(),

  socialLinks: z
    .array(z.url("Invalid social media URL."))
    .max(10, "Too many social links.")
    .optional(),

  profileImage: z.string().trim().optional(),

  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters.").optional(),

  hasAcceptedTerms: z
    .boolean()
    .refine((value) => value === true, "You must accept the terms and conditions."),
});

export type ProviderApplicationDto = z.infer<typeof providerApplicationSchema>;
