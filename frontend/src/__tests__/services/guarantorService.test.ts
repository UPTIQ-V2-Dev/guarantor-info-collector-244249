import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import {
    getGuarantors,
    getGuarantorById,
    createGuarantor,
    updateGuarantor,
    deleteGuarantor,
    getGuarantorStats,
    getRecentGuarantors,
    verifyGuarantor
} from '@/services/guarantorService';
import { mockGuarantorFormData } from '@/test/fixtures/guarantor';

// Mock environment variable
vi.mock('import.meta', () => ({
    env: {
        VITE_USE_MOCK_DATA: 'false'
    }
}));

describe('guarantorService', () => {
    beforeEach(() => {
        server.resetHandlers();
    });

    describe('getGuarantors', () => {
        it('fetches guarantors list successfully', async () => {
            const result = await getGuarantors();

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('pagination');
            expect(result.data).toBeInstanceOf(Array);
            expect(result.pagination).toHaveProperty('page');
            expect(result.pagination).toHaveProperty('total');
        });

        it('applies search filters', async () => {
            const result = await getGuarantors({ search: 'John' });

            expect(result.data).toBeInstanceOf(Array);
            // In our mock, we should get results containing 'John'
            if (result.data.length > 0) {
                expect(result.data.some(guarantor => guarantor.guarantor_name.includes('John'))).toBe(true);
            }
        });

        it('applies status filters', async () => {
            const result = await getGuarantors({ status: 'verified' });

            expect(result.data).toBeInstanceOf(Array);
            result.data.forEach(guarantor => {
                expect(guarantor.record_status).toBe('verified');
            });
        });

        it('handles pagination', async () => {
            const result = await getGuarantors({}, 1, 2);

            expect(result.pagination.page).toBe(1);
            expect(result.pagination.limit).toBe(2);
            expect(result.data.length).toBeLessThanOrEqual(2);
        });

        it('handles API errors', async () => {
            server.use(
                http.get('/api/v1/guarantors', () => {
                    return HttpResponse.json({ message: 'Server error' }, { status: 500 });
                })
            );

            await expect(getGuarantors()).rejects.toThrow();
        });
    });

    describe('getGuarantorById', () => {
        it('fetches specific guarantor successfully', async () => {
            const result = await getGuarantorById('test-guarantor-1');

            expect(result).toHaveProperty('id', 'test-guarantor-1');
            expect(result).toHaveProperty('guarantor_name');
            expect(result).toHaveProperty('record_status');
        });

        it('handles not found error', async () => {
            await expect(getGuarantorById('non-existent-id')).rejects.toThrow();
        });
    });

    describe('createGuarantor', () => {
        it('creates new guarantor successfully', async () => {
            const result = await createGuarantor(mockGuarantorFormData);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('guarantor_name', mockGuarantorFormData.guarantor_name);
            expect(result).toHaveProperty('record_status', 'pending_verification');
            expect(result).toHaveProperty('submission_timestamp');
            expect(result).toHaveProperty('submitted_by');
        });

        it('handles validation errors', async () => {
            server.use(
                http.post('/api/v1/guarantors', () => {
                    return HttpResponse.json(
                        {
                            message: 'Validation failed',
                            errors: { guarantor_name: ['Name is required'] }
                        },
                        { status: 400 }
                    );
                })
            );

            await expect(createGuarantor(mockGuarantorFormData)).rejects.toThrow();
        });
    });

    describe('updateGuarantor', () => {
        it('updates guarantor successfully', async () => {
            const updateData = {
                id: 'test-guarantor-1',
                guarantor_name: 'Updated Name'
            };

            const result = await updateGuarantor(updateData);

            expect(result).toHaveProperty('id', 'test-guarantor-1');
            expect(result).toHaveProperty('guarantor_name', 'Updated Name');
        });

        it('handles not found error', async () => {
            const updateData = {
                id: 'non-existent-id',
                guarantor_name: 'Updated Name'
            };

            await expect(updateGuarantor(updateData)).rejects.toThrow();
        });
    });

    describe('deleteGuarantor', () => {
        it('deletes guarantor successfully', async () => {
            await expect(deleteGuarantor('test-guarantor-1')).resolves.toBeUndefined();
        });

        it('handles not found error', async () => {
            await expect(deleteGuarantor('non-existent-id')).rejects.toThrow();
        });
    });

    describe('getGuarantorStats', () => {
        it('fetches statistics successfully', async () => {
            const result = await getGuarantorStats();

            expect(result).toHaveProperty('total');
            expect(result).toHaveProperty('pending_verification');
            expect(result).toHaveProperty('verified');
            expect(result).toHaveProperty('rejected');
            expect(typeof result.total).toBe('number');
        });
    });

    describe('getRecentGuarantors', () => {
        it('fetches recent guarantors successfully', async () => {
            const result = await getRecentGuarantors(3);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeLessThanOrEqual(3);
            if (result.length > 0) {
                expect(result[0]).toHaveProperty('id');
                expect(result[0]).toHaveProperty('guarantor_name');
            }
        });
    });

    describe('verifyGuarantor', () => {
        it('verifies guarantor successfully', async () => {
            const result = await verifyGuarantor('test-guarantor-1');

            expect(result).toHaveProperty('id', 'test-guarantor-1');
            expect(result).toHaveProperty('record_status', 'verified');
        });

        it('handles not found error', async () => {
            await expect(verifyGuarantor('non-existent-id')).rejects.toThrow();
        });
    });
});

// Test with mock data enabled
describe('guarantorService with mock data', () => {
    beforeEach(() => {
        // Mock the environment variable to use mock data
        vi.mocked(import.meta.env).VITE_USE_MOCK_DATA = 'true';
    });

    it('returns mock data when VITE_USE_MOCK_DATA is true', async () => {
        const result = await getGuarantors();

        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('pagination');
        expect(result.data).toBeInstanceOf(Array);
    });

    it('creates mock guarantor when VITE_USE_MOCK_DATA is true', async () => {
        const result = await createGuarantor(mockGuarantorFormData);

        expect(result).toHaveProperty('id');
        expect(result.id).toMatch(/^mock_/);
        expect(result).toHaveProperty('guarantor_name', mockGuarantorFormData.guarantor_name);
    });
});
