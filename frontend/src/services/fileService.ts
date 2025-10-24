import { api } from '@/lib/api';
import type { FileAttachment } from '@/types/guarantor';
import type { ApiResponse } from '@/types/api';
import { mockFileAttachments } from '@/data/mockData';

// Upload files for a guarantor record
export const uploadGuarantorFiles = async (guarantorId: string, files: File[]): Promise<FileAttachment[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Simulate file upload with mock data
        const mockUploads: FileAttachment[] = files.map((file, index) => ({
            id: `mock_file_${Date.now()}_${index}`,
            filename: file.name,
            file_type: file.type,
            file_size: file.size,
            upload_date: new Date().toISOString()
        }));

        return Promise.resolve(mockUploads);
    }

    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });

    const response = await api.post<ApiResponse<FileAttachment[]>>(`/guarantors/${guarantorId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.data;
};

// Get file attachments for a guarantor
export const getGuarantorFiles = async (guarantorId: string): Promise<FileAttachment[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Return mock files for the guarantor
        return Promise.resolve(mockFileAttachments);
    }

    const response = await api.get<ApiResponse<FileAttachment[]>>(`/guarantors/${guarantorId}/attachments`);

    return response.data.data;
};

// Download a specific file
export const downloadFile = async (guarantorId: string, fileId: string): Promise<Blob> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Return a mock PDF blob
        const mockContent = `Mock file content for file ${fileId}`;
        return Promise.resolve(new Blob([mockContent], { type: 'application/pdf' }));
    }

    const response = await api.get(`/guarantors/${guarantorId}/attachments/${fileId}/download`, {
        responseType: 'blob'
    });

    return response.data;
};

// Delete a file attachment
export const deleteFile = async (guarantorId: string, fileId: string): Promise<void> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Simulate successful deletion
        return Promise.resolve();
    }

    await api.delete(`/guarantors/${guarantorId}/attachments/${fileId}`);
};

// Validate file before upload
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    if (file.size > maxSize) {
        return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: 'File type not allowed. Please upload images, PDFs, or documents.' };
    }

    return { isValid: true };
};

// Get file type icon based on MIME type
export const getFileTypeIcon = (fileType: string): string => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType === 'application/pdf') return 'file-text';
    if (fileType.includes('word') || fileType.includes('document')) return 'file-text';
    if (fileType === 'text/plain') return 'file-text';
    return 'file';
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
