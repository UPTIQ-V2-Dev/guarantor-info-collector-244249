import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, User, Phone, Briefcase, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStep {
    id: string;
    title: string;
    description: string;
}

interface FormNavigationProps {
    steps: readonly FormStep[];
    currentStep: string;
    completedSteps: Set<string>;
    onStepClick: (stepId: string) => void;
}

const stepIcons: Record<string, React.ReactNode> = {
    personal: <User size={20} />,
    contact: <Phone size={20} />,
    employment: <Briefcase size={20} />,
    attachments: <Paperclip size={20} />
};

export const FormNavigation: React.FC<FormNavigationProps> = ({ steps, currentStep, completedSteps, onStepClick }) => {
    return (
        <Card className='mb-6'>
            <div className='p-4'>
                <div className='flex items-center justify-between'>
                    {steps.map((step, index) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = completedSteps.has(step.id);
                        const isClickable = true; // Allow clicking on any step

                        return (
                            <div
                                key={step.id}
                                className='flex items-center'
                            >
                                <div className='flex flex-col items-center'>
                                    <Button
                                        variant={isActive ? 'default' : isCompleted ? 'secondary' : 'outline'}
                                        size='sm'
                                        onClick={() => (isClickable ? onStepClick(step.id) : undefined)}
                                        disabled={!isClickable}
                                        className={cn(
                                            'w-12 h-12 rounded-full p-0 relative transition-all',
                                            isActive && 'ring-2 ring-primary ring-offset-2',
                                            isCompleted &&
                                                !isActive &&
                                                'bg-green-100 border-green-200 text-green-700 hover:bg-green-200',
                                            !isClickable && 'cursor-not-allowed opacity-50'
                                        )}
                                    >
                                        {isCompleted && !isActive ? (
                                            <Check size={20} />
                                        ) : (
                                            stepIcons[step.id] || <div>{index + 1}</div>
                                        )}
                                    </Button>

                                    <div className='mt-2 text-center'>
                                        <div
                                            className={cn(
                                                'text-sm font-medium',
                                                isActive
                                                    ? 'text-primary'
                                                    : isCompleted
                                                      ? 'text-green-700'
                                                      : 'text-muted-foreground'
                                            )}
                                        >
                                            {step.title}
                                        </div>
                                        <div className='text-xs text-muted-foreground mt-1 hidden md:block max-w-24'>
                                            {step.description}
                                        </div>
                                        {isCompleted && (
                                            <Badge
                                                variant='secondary'
                                                className='mt-1 text-xs'
                                            >
                                                ✓
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Connection line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            'flex-1 h-0.5 mx-4 mt-[-20px] transition-colors',
                                            isCompleted ? 'bg-green-200' : 'bg-border'
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};
