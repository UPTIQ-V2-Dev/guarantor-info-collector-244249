import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guarantorSchema } from '@/schemas/guarantorSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import { ContactDetailsSection } from './ContactDetailsSection';
import { EmploymentSection } from './EmploymentSection';
import { AttachmentsSection } from './AttachmentsSection';
import { FormNavigation } from './FormNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';
import type { GuarantorFormData, GuarantorRecord } from '@/types/guarantor';

interface GuarantorFormProps {
    initialData?: GuarantorRecord;
    onSubmit: (data: GuarantorFormData) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
}

const FORM_STEPS = [
    { id: 'personal', title: 'Personal Details', description: 'Basic personal information' },
    { id: 'contact', title: 'Contact & Identity', description: 'Contact details and identity verification' },
    { id: 'employment', title: 'Professional Background', description: 'Employment and business information' },
    { id: 'attachments', title: 'Documents', description: 'Supporting documents and attachments' }
] as const;

type FormStep = (typeof FORM_STEPS)[number]['id'];

export const GuarantorForm: React.FC<GuarantorFormProps> = ({
    initialData,
    onSubmit,
    isLoading = false,
    isEdit = false
}) => {
    const [currentStep, setCurrentStep] = useState<FormStep>('personal');
    const [completedSteps, setCompletedSteps] = useState<Set<FormStep>>(new Set());

    const form = useForm({
        resolver: zodResolver(guarantorSchema),
        defaultValues: {
            guarantor_name: initialData?.guarantor_name || '',
            relationship_to_borrower: initialData?.relationship_to_borrower || '',
            address: {
                street: initialData?.address?.street || '',
                city: initialData?.address?.city || '',
                state: initialData?.address?.state || '',
                zip: initialData?.address?.zip || ''
            },
            date_of_birth: initialData?.date_of_birth || '',
            occupation: initialData?.occupation || '',
            employer_or_business: initialData?.employer_or_business || '',
            linkedin_profile: initialData?.linkedin_profile || '',
            company_registration_number: initialData?.company_registration_number || '',
            known_associations: initialData?.known_associations || [],
            comments: initialData?.comments || '',
            phone: initialData?.phone || '',
            email: initialData?.email || ''
        },
        mode: 'onChange'
    });

    const {
        watch,
        trigger,
        handleSubmit,
        formState: { isValid }
    } = form;
    const watchedValues = watch();

    // Auto-save functionality (localStorage for drafts)
    useEffect(() => {
        if (!isEdit) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem('guarantor_form_draft', JSON.stringify(watchedValues));
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [watchedValues, isEdit]);

    // Load draft on mount for new forms
    useEffect(() => {
        if (!isEdit && !initialData) {
            const draft = localStorage.getItem('guarantor_form_draft');
            if (draft) {
                try {
                    const parsedDraft = JSON.parse(draft);
                    form.reset(parsedDraft);
                } catch (error) {
                    console.error('Failed to load draft:', error);
                }
            }
        }
    }, [form, isEdit, initialData]);

    const getCurrentStepIndex = () => FORM_STEPS.findIndex(step => step.id === currentStep);
    const currentStepData = FORM_STEPS[getCurrentStepIndex()];
    const progress = ((getCurrentStepIndex() + 1) / FORM_STEPS.length) * 100;

    const validateCurrentStep = async (): Promise<boolean> => {
        const stepFieldMap: Record<FormStep, string[]> = {
            personal: ['guarantor_name', 'relationship_to_borrower', 'address', 'date_of_birth'],
            contact: ['phone', 'email'],
            employment: [
                'occupation',
                'employer_or_business',
                'linkedin_profile',
                'company_registration_number',
                'known_associations'
            ],
            attachments: ['comments']
        };

        const fieldsToValidate = stepFieldMap[currentStep];
        const isStepValid = await trigger(fieldsToValidate as any);

        if (isStepValid) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
        } else {
            setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete(currentStep);
                return newSet;
            });
        }

        return isStepValid;
    };

    const handleNext = async () => {
        const isStepValid = await validateCurrentStep();
        if (isStepValid) {
            const currentIndex = getCurrentStepIndex();
            if (currentIndex < FORM_STEPS.length - 1) {
                setCurrentStep(FORM_STEPS[currentIndex + 1].id);
            }
        }
    };

    const handlePrevious = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
            setCurrentStep(FORM_STEPS[currentIndex - 1].id);
        }
    };

    const handleStepClick = async (stepId: string) => {
        // Allow navigation to any step, but validate current step first
        await validateCurrentStep();
        setCurrentStep(stepId as FormStep);
    };

    const handleFormSubmit = async (data: any) => {
        try {
            await onSubmit(data as GuarantorFormData);
            // Clear draft after successful submission
            if (!isEdit) {
                localStorage.removeItem('guarantor_form_draft');
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleSaveDraft = async () => {
        await validateCurrentStep();
        localStorage.setItem('guarantor_form_draft', JSON.stringify(watchedValues));
        // Could show a toast notification here
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'personal':
                return <PersonalDetailsSection form={form} />;
            case 'contact':
                return <ContactDetailsSection form={form} />;
            case 'employment':
                return <EmploymentSection form={form} />;
            case 'attachments':
                return (
                    <AttachmentsSection
                        form={form}
                        guarantorId={initialData?.id}
                    />
                );
            default:
                return <PersonalDetailsSection form={form} />;
        }
    };

    const isFirstStep = getCurrentStepIndex() === 0;
    const isLastStep = getCurrentStepIndex() === FORM_STEPS.length - 1;

    return (
        <div className='w-full max-w-4xl mx-auto'>
            {/* Progress Header */}
            <Card className='mb-6'>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle className='text-xl'>
                                {isEdit ? 'Edit Guarantor Information' : 'New Guarantor Information'}
                            </CardTitle>
                            <p className='text-sm text-muted-foreground mt-1'>
                                Step {getCurrentStepIndex() + 1} of {FORM_STEPS.length}: {currentStepData.description}
                            </p>
                        </div>
                        {!isEdit && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleSaveDraft}
                                className='gap-2'
                            >
                                <Save size={16} />
                                Save Draft
                            </Button>
                        )}
                    </div>
                    <div className='mt-4'>
                        <Progress
                            value={progress}
                            className='h-2'
                        />
                    </div>
                </CardHeader>
            </Card>

            {/* Step Navigation */}
            <FormNavigation
                steps={FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
            />

            {/* Form Content */}
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle className='text-lg flex items-center gap-2'>
                                    {currentStepData.title}
                                    {completedSteps.has(currentStep) && (
                                        <Badge
                                            variant='secondary'
                                            className='text-xs'
                                        >
                                            Completed
                                        </Badge>
                                    )}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>{renderCurrentStep()}</CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className='flex justify-between items-center'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handlePrevious}
                            disabled={isFirstStep}
                            className='gap-2'
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </Button>

                        <div className='flex gap-2'>
                            {!isLastStep ? (
                                <Button
                                    type='button'
                                    onClick={handleNext}
                                    className='gap-2'
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </Button>
                            ) : (
                                <Button
                                    type='submit'
                                    disabled={!isValid || isLoading}
                                    className='gap-2'
                                >
                                    <Send size={16} />
                                    {isLoading ? 'Submitting...' : isEdit ? 'Update Guarantor' : 'Submit Information'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
