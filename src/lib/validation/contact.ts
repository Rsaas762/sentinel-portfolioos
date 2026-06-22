import { z } from "zod";

/**
 * Shared contact-form schema. Used by the client form for instant feedback
 * AND re-validated on the server in the API route — the server never trusts
 * client input.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .max(200, "Email is too long."),
  subject: z
    .string()
    .trim()
    .max(160, "Subject is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(4000, "Message is too long (4000 characters max)."),
  // Honeypot: must stay empty. Bots tend to fill every field.
  website: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const CONTACT_FIELD_LIMITS = {
  message: 4000,
} as const;
