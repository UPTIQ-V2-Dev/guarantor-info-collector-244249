import { describe, it, expect } from 'vitest';
import { guarantorSchema, guarantorFiltersSchema } from '@/schemas/guarantorSchema';
import { mockGuarantorFormData } from '@/test/fixtures/guarantor';

describe('guarantorSchema', () => {
    it('validates a valid guarantor form data', () => {
        const result = guarantorSchema.safeParse(mockGuarantorFormData);
        expect(result.success).toBe(true);
    });

    it('validates required fields', () => {
        const invalidData = {
            ...mockGuarantorFormData,
            guarantor_name: ''
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors).toContainEqual(
                expect.objectContaining({
                    path: ['guarantor_name'],
                    message: 'Name is required'
                })
            );
        }
    });

    it('validates email format', () => {
        const invalidData = {
            ...mockGuarantorFormData,
            email: 'invalid-email'
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors).toContainEqual(
                expect.objectContaining({
                    path: ['email'],
                    message: 'Invalid email format'
                })
            );
        }
    });

    it('allows empty email', () => {
        const validData = {
            ...mockGuarantorFormData,
            email: ''
        };

        const result = guarantorSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('validates phone number format', () => {
        const invalidData = {
            ...mockGuarantorFormData,
            phone: 'invalid-phone'
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors).toContainEqual(
                expect.objectContaining({
                    path: ['phone'],
                    message: 'Invalid phone format'
                })
            );
        }
    });

    it('validates ZIP code format', () => {
        const invalidData = {
            ...mockGuarantorFormData,
            address: {
                ...mockGuarantorFormData.address,
                zip: '123'
            }
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors).toContainEqual(
                expect.objectContaining({
                    path: ['address', 'zip'],
                    message: 'Invalid ZIP code format'
                })
            );
        }
    });

    it('accepts valid ZIP codes', () => {
        const testCases = ['85001', '85001-1234'];

        testCases.forEach(zip => {
            const validData = {
                ...mockGuarantorFormData,
                address: {
                    ...mockGuarantorFormData.address,
                    zip
                }
            };

            const result = guarantorSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    it('validates date format', () => {
        const invalidData = {
            ...mockGuarantorFormData,
            date_of_birth: 'invalid-date'
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('rejects future dates', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);

        const invalidData = {
            ...mockGuarantorFormData,
            date_of_birth: futureDate.toISOString().split('T')[0]
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors).toContainEqual(
                expect.objectContaining({
                    path: ['date_of_birth'],
                    message: 'Invalid date format or future date not allowed'
                })
            );
        }
    });

    it('validates LinkedIn URL format', () => {
        const invalidData = {
            ...mockGuarantorFormData,
            linkedin_profile: 'not-a-url'
        };

        const result = guarantorSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors).toContainEqual(
                expect.objectContaining({
                    path: ['linkedin_profile'],
                    message: 'Invalid LinkedIn URL'
                })
            );
        }
    });

    it('allows empty optional fields', () => {
        const minimalData = {
            guarantor_name: 'John Doe',
            relationship_to_borrower: 'Business Partner',
            address: {
                street: '123 Test St',
                city: 'Phoenix',
                state: 'AZ',
                zip: '85001'
            },
            date_of_birth: '1980-01-15',
            occupation: 'Engineer',
            employer_or_business: '',
            linkedin_profile: '',
            company_registration_number: '',
            known_associations: [],
            comments: '',
            phone: '',
            email: ''
        };

        const result = guarantorSchema.safeParse(minimalData);
        expect(result.success).toBe(true);
    });
});

describe('guarantorFiltersSchema', () => {
    it('validates valid filters', () => {
        const validFilters = {
            search: 'john',
            status: 'pending_verification' as const,
            submitted_by: 'user123',
            date_from: '2024-01-01',
            date_to: '2024-01-31'
        };

        const result = guarantorFiltersSchema.safeParse(validFilters);
        expect(result.success).toBe(true);
    });

    it('validates empty filters', () => {
        const result = guarantorFiltersSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it('validates status enum values', () => {
        const validStatuses = ['pending_verification', 'verified', 'rejected'];

        validStatuses.forEach(status => {
            const result = guarantorFiltersSchema.safeParse({ status });
            expect(result.success).toBe(true);
        });
    });

    it('rejects invalid status values', () => {
        const result = guarantorFiltersSchema.safeParse({ status: 'invalid_status' });
        expect(result.success).toBe(false);
    });
});
