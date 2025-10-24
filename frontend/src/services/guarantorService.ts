import { api } from '@/lib/api';
import type {
    GuarantorRecord,
    CreateGuarantorInput,
    UpdateGuarantorInput,
    GuarantorFilters,
    GuarantorStats
} from '@/types/guarantor';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { mockGuarantorRecords, mockGuarantorStats } from '@/data/mockData';

// Get all guarantors with filtering and pagination
export const getGuarantors = async (
    filters: GuarantorFilters = {},
    page: number = 1,
    limit: number = 10
): Promise<PaginatedResponse<GuarantorRecord>> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Apply mock filtering logic
        let filteredData = [...mockGuarantorRecords];

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredData = filteredData.filter(
                record =>
                    record.guarantor_name.toLowerCase().includes(searchTerm) ||
                    record.relationship_to_borrower.toLowerCase().includes(searchTerm) ||
                    record.occupation.toLowerCase().includes(searchTerm) ||
                    record.employer_or_business?.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.status) {
            filteredData = filteredData.filter(record => record.record_status === filters.status);
        }

        if (filters.submitted_by) {
            filteredData = filteredData.filter(record => record.submitted_by === filters.submitted_by);
        }

        // Simulate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return Promise.resolve({
            data: paginatedData,
            pagination: {
                page,
                limit,
                total: filteredData.length,
                totalPages: Math.ceil(filteredData.length / limit)
            }
        });
    }

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== ''))
    });

    const response = await api.get<PaginatedResponse<GuarantorRecord>>(`/guarantors?${queryParams.toString()}`);
    return response.data;
};

// Get a specific guarantor by ID
export const getGuarantorById = async (id: string): Promise<GuarantorRecord> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const guarantor = mockGuarantorRecords.find(record => record.id === id);
        if (!guarantor) {
            throw new Error(`Guarantor with ID ${id} not found`);
        }
        return Promise.resolve(guarantor);
    }

    const response = await api.get<ApiResponse<GuarantorRecord>>(`/guarantors/${id}`);
    return response.data.data;
};

// Create a new guarantor record
export const createGuarantor = async (data: CreateGuarantorInput): Promise<GuarantorRecord> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const newRecord: GuarantorRecord = {
            ...data,
            id: `mock_${Date.now()}`,
            submission_timestamp: new Date().toISOString(),
            submitted_by: 'CurrentUser', // In real app, get from auth context
            record_status: 'pending_verification',
            attachments: []
        };
        return Promise.resolve(newRecord);
    }

    const response = await api.post<ApiResponse<GuarantorRecord>>('/guarantors', data);
    return response.data.data;
};

// Update an existing guarantor record
export const updateGuarantor = async (data: UpdateGuarantorInput): Promise<GuarantorRecord> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const existingRecord = mockGuarantorRecords.find(record => record.id === data.id);
        if (!existingRecord) {
            throw new Error(`Guarantor with ID ${data.id} not found`);
        }

        const updatedRecord: GuarantorRecord = {
            ...existingRecord,
            ...data,
            submission_timestamp: existingRecord.submission_timestamp, // Keep original timestamp
            submitted_by: existingRecord.submitted_by // Keep original submitter
        };
        return Promise.resolve(updatedRecord);
    }

    const { id, ...updateData } = data;
    const response = await api.put<ApiResponse<GuarantorRecord>>(`/guarantors/${id}`, updateData);
    return response.data.data;
};

// Delete a guarantor record
export const deleteGuarantor = async (id: string): Promise<void> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const recordExists = mockGuarantorRecords.some(record => record.id === id);
        if (!recordExists) {
            throw new Error(`Guarantor with ID ${id} not found`);
        }
        return Promise.resolve();
    }

    await api.delete(`/guarantors/${id}`);
};

// Get dashboard statistics
export const getGuarantorStats = async (): Promise<GuarantorStats> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return Promise.resolve(mockGuarantorStats);
    }

    const response = await api.get<ApiResponse<GuarantorStats>>('/guarantors/stats');
    return response.data.data;
};

// Get recent submissions for dashboard
export const getRecentGuarantors = async (limit: number = 5): Promise<GuarantorRecord[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Return most recent submissions (sorted by timestamp desc)
        const sorted = [...mockGuarantorRecords]
            .sort((a, b) => new Date(b.submission_timestamp).getTime() - new Date(a.submission_timestamp).getTime())
            .slice(0, limit);
        return Promise.resolve(sorted);
    }

    const response = await api.get<ApiResponse<GuarantorRecord[]>>(`/guarantors/recent?limit=${limit}`);
    return response.data.data;
};

// Trigger verification process for a guarantor
export const verifyGuarantor = async (id: string): Promise<GuarantorRecord> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const existingRecord = mockGuarantorRecords.find(record => record.id === id);
        if (!existingRecord) {
            throw new Error(`Guarantor with ID ${id} not found`);
        }

        const verifiedRecord: GuarantorRecord = {
            ...existingRecord,
            record_status: 'verified'
        };
        return Promise.resolve(verifiedRecord);
    }

    const response = await api.post<ApiResponse<GuarantorRecord>>(`/guarantors/${id}/verify`);
    return response.data.data;
};

// Export guarantor data
export const exportGuarantors = async (filters: GuarantorFilters = {}): Promise<Blob> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Create a mock CSV export
        const headers = ['Name', 'Relationship', 'City', 'State', 'Status', 'Submitted Date'];
        const csvContent = [
            headers.join(','),
            ...mockGuarantorRecords.map(record =>
                [
                    record.guarantor_name,
                    record.relationship_to_borrower,
                    record.address.city,
                    record.address.state,
                    record.record_status,
                    new Date(record.submission_timestamp).toLocaleDateString()
                ].join(',')
            )
        ].join('\n');

        return Promise.resolve(new Blob([csvContent], { type: 'text/csv' }));
    }

    const queryParams = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== ''))
    );

    const response = await api.get(`/guarantors/export?${queryParams.toString()}`, {
        responseType: 'blob'
    });

    return response.data;
};
