import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getGuarantors,
    getGuarantorById,
    createGuarantor,
    updateGuarantor,
    deleteGuarantor,
    getGuarantorStats,
    getRecentGuarantors,
    verifyGuarantor,
    exportGuarantors
} from '@/services/guarantorService';
import type { GuarantorFilters, CreateGuarantorInput, UpdateGuarantorInput } from '@/types/guarantor';

// Query keys
export const guarantorKeys = {
    all: ['guarantors'] as const,
    lists: () => [...guarantorKeys.all, 'list'] as const,
    list: (filters: GuarantorFilters, page: number, limit: number) =>
        [...guarantorKeys.lists(), filters, page, limit] as const,
    details: () => [...guarantorKeys.all, 'detail'] as const,
    detail: (id: string) => [...guarantorKeys.details(), id] as const,
    stats: () => [...guarantorKeys.all, 'stats'] as const,
    recent: (limit: number) => [...guarantorKeys.all, 'recent', limit] as const
} as const;

// Get paginated guarantors list
export const useGuarantors = (filters: GuarantorFilters = {}, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: guarantorKeys.list(filters, page, limit),
        queryFn: () => getGuarantors(filters, page, limit),
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
};

// Get single guarantor by ID
export const useGuarantor = (id: string) => {
    return useQuery({
        queryKey: guarantorKeys.detail(id),
        queryFn: () => getGuarantorById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    });
};

// Get dashboard stats
export const useGuarantorStats = () => {
    return useQuery({
        queryKey: guarantorKeys.stats(),
        queryFn: getGuarantorStats,
        staleTime: 2 * 60 * 1000 // 2 minutes
    });
};

// Get recent submissions
export const useRecentGuarantors = (limit: number = 5) => {
    return useQuery({
        queryKey: guarantorKeys.recent(limit),
        queryFn: () => getRecentGuarantors(limit),
        staleTime: 2 * 60 * 1000
    });
};

// Create new guarantor
export const useCreateGuarantor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGuarantorInput) => createGuarantor(data),
        onSuccess: () => {
            // Invalidate and refetch guarantors list and stats
            queryClient.invalidateQueries({ queryKey: guarantorKeys.lists() });
            queryClient.invalidateQueries({ queryKey: guarantorKeys.stats() });
            queryClient.invalidateQueries({ queryKey: guarantorKeys.recent(5) });
        }
    });
};

// Update existing guarantor
export const useUpdateGuarantor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateGuarantorInput) => updateGuarantor(data),
        onSuccess: updatedGuarantor => {
            // Update the specific guarantor in cache
            queryClient.setQueryData(guarantorKeys.detail(updatedGuarantor.id), updatedGuarantor);

            // Invalidate lists to refetch updated data
            queryClient.invalidateQueries({ queryKey: guarantorKeys.lists() });
            queryClient.invalidateQueries({ queryKey: guarantorKeys.stats() });
        }
    });
};

// Delete guarantor
export const useDeleteGuarantor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteGuarantor(id),
        onSuccess: (_, deletedId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: guarantorKeys.detail(deletedId) });

            // Invalidate lists and stats
            queryClient.invalidateQueries({ queryKey: guarantorKeys.lists() });
            queryClient.invalidateQueries({ queryKey: guarantorKeys.stats() });
            queryClient.invalidateQueries({ queryKey: guarantorKeys.recent(5) });
        }
    });
};

// Verify guarantor
export const useVerifyGuarantor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => verifyGuarantor(id),
        onSuccess: verifiedGuarantor => {
            // Update the specific guarantor in cache
            queryClient.setQueryData(guarantorKeys.detail(verifiedGuarantor.id), verifiedGuarantor);

            // Invalidate lists and stats to reflect status change
            queryClient.invalidateQueries({ queryKey: guarantorKeys.lists() });
            queryClient.invalidateQueries({ queryKey: guarantorKeys.stats() });
        }
    });
};

// Export guarantors
export const useExportGuarantors = () => {
    return useMutation({
        mutationFn: (filters: GuarantorFilters = {}) => exportGuarantors(filters),
        onSuccess: blob => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `guarantors_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    });
};
