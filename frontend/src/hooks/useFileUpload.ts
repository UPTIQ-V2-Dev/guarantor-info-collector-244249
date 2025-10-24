import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    uploadGuarantorFiles,
    getGuarantorFiles,
    downloadFile,
    deleteFile,
    validateFile
} from '@/services/fileService';

// Query keys for file operations
export const fileKeys = {
    all: ['files'] as const,
    guarantorFiles: (guarantorId: string) => [...fileKeys.all, 'guarantor', guarantorId] as const
} as const;

// Get files for a guarantor
export const useGuarantorFiles = (guarantorId: string) => {
    return useQuery({
        queryKey: fileKeys.guarantorFiles(guarantorId),
        queryFn: () => getGuarantorFiles(guarantorId),
        enabled: !!guarantorId,
        staleTime: 5 * 60 * 1000
    });
};

// Upload files for a guarantor
export const useUploadFiles = (guarantorId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (files: File[]) => {
            // Validate files before upload
            const validationResults = files.map(validateFile);
            const invalidFiles = validationResults.filter(result => !result.isValid);

            if (invalidFiles.length > 0) {
                throw new Error(`Invalid files: ${invalidFiles.map(f => f.error).join(', ')}`);
            }

            return uploadGuarantorFiles(guarantorId, files);
        },
        onSuccess: () => {
            // Refetch files for this guarantor
            queryClient.invalidateQueries({ queryKey: fileKeys.guarantorFiles(guarantorId) });
        }
    });
};

// Download a file
export const useDownloadFile = () => {
    return useMutation({
        mutationFn: ({ guarantorId, fileId, filename }: { guarantorId: string; fileId: string; filename: string }) =>
            downloadFile(guarantorId, fileId),
        onSuccess: (blob, variables) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = variables.filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    });
};

// Delete a file
export const useDeleteFile = (guarantorId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fileId: string) => deleteFile(guarantorId, fileId),
        onSuccess: () => {
            // Refetch files for this guarantor
            queryClient.invalidateQueries({ queryKey: fileKeys.guarantorFiles(guarantorId) });
        }
    });
};

// Custom hook for handling file validation
export const useFileValidation = () => {
    const validateFiles = (files: File[]) => {
        return files.map(file => ({
            file,
            validation: validateFile(file)
        }));
    };

    return { validateFiles, validateFile };
};
