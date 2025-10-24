import { z } from 'zod';

export const guarantorSchema = z.object({
    guarantor_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    relationship_to_borrower: z
        .string()
        .min(1, 'Relationship is required')
        .max(200, 'Relationship description too long'),
    address: z.object({
        street: z.string().min(1, 'Street address is required').max(200, 'Street address too long'),
        city: z.string().min(1, 'City is required').max(100, 'City name too long'),
        state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
        zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    }),
    date_of_birth: z.string().refine(date => {
        const parsed = new Date(date);
        const now = new Date();
        return parsed instanceof Date && !isNaN(parsed.getTime()) && parsed < now;
    }, 'Invalid date format or future date not allowed'),
    occupation: z.string().min(1, 'Occupation is required').max(100, 'Occupation too long'),
    employer_or_business: z.string().max(200, 'Employer/business name too long').optional(),
    linkedin_profile: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    company_registration_number: z.string().max(50, 'Registration number too long').optional(),
    known_associations: z.array(z.string().max(200, 'Association name too long')).default([]),
    comments: z.string().max(1000, 'Comments too long').optional(),
    phone: z
        .string()
        .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone format')
        .optional()
        .or(z.literal('')),
    email: z.string().email('Invalid email format').optional().or(z.literal(''))
});

export const guarantorFiltersSchema = z.object({
    search: z.string().optional(),
    status: z.enum(['pending_verification', 'verified', 'rejected']).optional(),
    submitted_by: z.string().optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional()
});

export type GuarantorFormSchemaType = z.infer<typeof guarantorSchema>;
export type GuarantorFiltersSchemaType = z.infer<typeof guarantorFiltersSchema>;
