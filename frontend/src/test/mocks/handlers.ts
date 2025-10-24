import { http, HttpResponse } from 'msw';
import type { GuarantorFilters } from '@/types/guarantor';
import { mockGuarantorList, mockFileAttachment } from '../fixtures/guarantor';

export const handlers = [
    // Get guarantors list with filtering and pagination
    http.get('/api/v1/guarantors', ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const status = url.searchParams.get('status') as GuarantorFilters['status'];
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        let filteredData = [...mockGuarantorList];

        // Apply search filter
        if (search) {
            filteredData = filteredData.filter(
                guarantor =>
                    guarantor.guarantor_name.toLowerCase().includes(search.toLowerCase()) ||
                    guarantor.relationship_to_borrower.toLowerCase().includes(search.toLowerCase()) ||
                    guarantor.occupation.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply status filter
        if (status) {
            filteredData = filteredData.filter(guarantor => guarantor.record_status === status);
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return HttpResponse.json({
            data: paginatedData,
            pagination: {
                page,
                limit,
                total: filteredData.length,
                totalPages: Math.ceil(filteredData.length / limit)
            }
        });
    }),

    // Get specific guarantor by ID
    http.get('/api/v1/guarantors/:id', ({ params }) => {
        const { id } = params;
        const guarantor = mockGuarantorList.find(g => g.id === id);

        if (!guarantor) {
            return HttpResponse.json({ message: 'Guarantor not found' }, { status: 404 });
        }

        return HttpResponse.json({
            data: guarantor,
            success: true
        });
    }),

    // Create new guarantor
    http.post('/api/v1/guarantors', async ({ request }) => {
        const data = await request.json();
        const newGuarantor = {
            ...data,
            id: `test-new-${Date.now()}`,
            submission_timestamp: new Date().toISOString(),
            submitted_by: 'TestUser',
            record_status: 'pending_verification' as const,
            attachments: []
        };

        return HttpResponse.json({
            data: newGuarantor,
            success: true
        });
    }),

    // Update guarantor
    http.put('/api/v1/guarantors/:id', async ({ params, request }) => {
        const { id } = params;
        const data = await request.json();
        const existingGuarantor = mockGuarantorList.find(g => g.id === id);

        if (!existingGuarantor) {
            return HttpResponse.json({ message: 'Guarantor not found' }, { status: 404 });
        }

        const updatedGuarantor = {
            ...existingGuarantor,
            ...data
        };

        return HttpResponse.json({
            data: updatedGuarantor,
            success: true
        });
    }),

    // Delete guarantor
    http.delete('/api/v1/guarantors/:id', ({ params }) => {
        const { id } = params;
        const guarantorExists = mockGuarantorList.some(g => g.id === id);

        if (!guarantorExists) {
            return HttpResponse.json({ message: 'Guarantor not found' }, { status: 404 });
        }

        return HttpResponse.json({ success: true });
    }),

    // Get guarantor statistics
    http.get('/api/v1/guarantors/stats', () => {
        const stats = {
            total: mockGuarantorList.length,
            pending_verification: mockGuarantorList.filter(g => g.record_status === 'pending_verification').length,
            verified: mockGuarantorList.filter(g => g.record_status === 'verified').length,
            rejected: mockGuarantorList.filter(g => g.record_status === 'rejected').length
        };

        return HttpResponse.json({
            data: stats,
            success: true
        });
    }),

    // Get recent guarantors
    http.get('/api/v1/guarantors/recent', ({ request }) => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '5');

        const recent = mockGuarantorList
            .sort((a, b) => new Date(b.submission_timestamp).getTime() - new Date(a.submission_timestamp).getTime())
            .slice(0, limit);

        return HttpResponse.json({
            data: recent,
            success: true
        });
    }),

    // Verify guarantor
    http.post('/api/v1/guarantors/:id/verify', ({ params }) => {
        const { id } = params;
        const guarantor = mockGuarantorList.find(g => g.id === id);

        if (!guarantor) {
            return HttpResponse.json({ message: 'Guarantor not found' }, { status: 404 });
        }

        const verifiedGuarantor = {
            ...guarantor,
            record_status: 'verified' as const
        };

        return HttpResponse.json({
            data: verifiedGuarantor,
            success: true
        });
    }),

    // File operations
    http.get('/api/v1/guarantors/:id/attachments', ({ params }) => {
        const { id } = params;
        if (id === 'test-guarantor-with-files') {
            return HttpResponse.json({
                data: [mockFileAttachment],
                success: true
            });
        }
        return HttpResponse.json({
            data: [],
            success: true
        });
    }),

    http.post('/api/v1/guarantors/:id/attachments', () => {
        return HttpResponse.json({
            data: [mockFileAttachment],
            success: true
        });
    }),

    http.delete('/api/v1/guarantors/:id/attachments/:fileId', () => {
        return HttpResponse.json({ success: true });
    }),

    http.get('/api/v1/guarantors/:id/attachments/:fileId/download', () => {
        const mockContent = 'Mock file content';
        return HttpResponse.text(mockContent, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"'
            }
        });
    })
];
