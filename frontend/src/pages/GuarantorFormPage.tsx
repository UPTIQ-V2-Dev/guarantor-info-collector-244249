import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GuarantorForm } from '@/components/forms/GuarantorForm';
import { useGuarantor, useCreateGuarantor, useUpdateGuarantor } from '@/hooks/useGuarantors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { GuarantorFormData } from '@/types/guarantor';

export const GuarantorFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    // Hooks
    const {
        data: existingGuarantor,
        isLoading: isLoadingGuarantor,
        error: loadError
    } = useGuarantor(isEdit ? id || '' : '');

    const createMutation = useCreateGuarantor();
    const updateMutation = useUpdateGuarantor();

    const handleSubmit = async (data: GuarantorFormData) => {
        try {
            if (isEdit && id) {
                // Update existing guarantor
                await updateMutation.mutateAsync({ ...data, id });
                toast.success('Guarantor information updated successfully');
                navigate(`/guarantor/${id}`);
            } else {
                // Create new guarantor
                const newGuarantor = await createMutation.mutateAsync(data);
                toast.success('Guarantor information submitted successfully');
                navigate(`/guarantor/${newGuarantor.id}`);
            }
        } catch (error: any) {
            console.error('Form submission error:', error);
            toast.error(
                error.response?.data?.message ||
                    (isEdit ? 'Failed to update guarantor information' : 'Failed to submit guarantor information')
            );
            throw error; // Re-throw to prevent form from clearing
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    // Loading state for edit mode
    if (isEdit && isLoadingGuarantor) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <div className='flex items-center justify-center min-h-[400px]'>
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='h-8 w-8 animate-spin' />
                        <p className='text-muted-foreground'>Loading guarantor information...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state for edit mode
    if (isEdit && loadError) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-2xl mx-auto'>
                    <Alert variant='destructive'>
                        <AlertDescription>
                            Failed to load guarantor information. Please try again or contact support if the problem
                            persists.
                        </AlertDescription>
                    </Alert>
                    <div className='mt-6 flex justify-center'>
                        <Button
                            onClick={() => navigate('/guarantors')}
                            variant='outline'
                        >
                            Back to Guarantors List
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='mb-8'>
                <div className='flex items-center gap-4 mb-4'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleBackClick}
                        className='gap-2'
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            {isEdit ? 'Edit Guarantor Information' : 'New Guarantor Background Check'}
                        </CardTitle>
                        <p className='text-muted-foreground'>
                            {isEdit
                                ? `Update information for ${existingGuarantor?.guarantor_name || 'this guarantor'}`
                                : 'Collect and organize guarantor information for background verification'}
                        </p>
                    </CardHeader>
                </Card>
            </div>

            {/* Form */}
            <GuarantorForm
                initialData={existingGuarantor}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                isEdit={isEdit}
            />

            {/* Help Information */}
            <Card className='mt-8 border-blue-200 bg-blue-50/50'>
                <CardContent className='pt-6'>
                    <div className='space-y-3'>
                        <h3 className='font-medium text-blue-900'>Need Help?</h3>
                        <div className='space-y-2 text-sm text-blue-800'>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>All fields marked with an asterisk (*) are required for submission.</span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>Your progress is automatically saved as you complete each section.</span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>Supporting documents help expedite the verification process.</span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>
                                    Contact support if you encounter any issues or have questions about specific fields.
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
