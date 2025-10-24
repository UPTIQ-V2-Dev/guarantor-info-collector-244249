import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Briefcase, Building, Hash, Linkedin } from 'lucide-react';

interface EmploymentSectionProps {
    form: UseFormReturn<any>;
}

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({ form }) => {
    const [newAssociation, setNewAssociation] = useState('');
    const { watch, setValue } = form;
    const knownAssociations = watch('known_associations') || [];

    const addAssociation = () => {
        if (newAssociation.trim() && !knownAssociations.includes(newAssociation.trim())) {
            setValue('known_associations', [...knownAssociations, newAssociation.trim()]);
            setNewAssociation('');
        }
    };

    const removeAssociation = (index: number) => {
        const updated = knownAssociations.filter((_: any, i: number) => i !== index);
        setValue('known_associations', updated);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addAssociation();
        }
    };

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Occupation */}
                <FormField
                    control={form.control}
                    name='occupation'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='required flex items-center gap-2'>
                                <Briefcase size={16} />
                                Occupation / Title
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='e.g., Real Estate Investor, CEO, Financial Consultant'
                                    {...field}
                                    className='h-11'
                                />
                            </FormControl>
                            <FormDescription>Primary occupation or professional title</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Employer or Business */}
                <FormField
                    control={form.control}
                    name='employer_or_business'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                                <Building size={16} />
                                Employer / Business Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='e.g., Davis Capital Group, Self-employed'
                                    {...field}
                                    className='h-11'
                                />
                            </FormControl>
                            <FormDescription>Company name or indicate if self-employed</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Company Registration Number */}
                <FormField
                    control={form.control}
                    name='company_registration_number'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                                <Hash size={16} />
                                Company Registration / EIN
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='e.g., EIN-123456789'
                                    {...field}
                                    className='h-11'
                                />
                            </FormControl>
                            <FormDescription>Business registration number (if applicable)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* LinkedIn Profile */}
                <FormField
                    control={form.control}
                    name='linkedin_profile'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                                <Linkedin size={16} />
                                LinkedIn Profile URL
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='url'
                                    placeholder='https://www.linkedin.com/in/username'
                                    {...field}
                                    className='h-11'
                                />
                            </FormControl>
                            <FormDescription>Professional LinkedIn profile (helps with verification)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Business Associations */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-lg'>Business Associations & Memberships</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div>
                        <FormLabel>Professional Associations</FormLabel>
                        <FormDescription className='mb-3'>
                            List professional organizations, board memberships, or business associations
                        </FormDescription>

                        {/* Current Associations */}
                        {knownAssociations.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-3'>
                                {knownAssociations.map((association: any, index: number) => (
                                    <Badge
                                        key={index}
                                        variant='secondary'
                                        className='px-3 py-1'
                                    >
                                        {association}
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            className='h-auto p-0 ml-2 hover:bg-transparent'
                                            onClick={() => removeAssociation(index)}
                                        >
                                            <X size={12} />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Add New Association */}
                        <div className='flex gap-2'>
                            <Input
                                placeholder='e.g., Phoenix Real Estate Association'
                                value={newAssociation}
                                onChange={e => setNewAssociation(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className='h-10'
                            />
                            <Button
                                type='button'
                                onClick={addAssociation}
                                disabled={!newAssociation.trim()}
                                className='px-3'
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        <div className='text-sm text-muted-foreground mt-2'>
                            Examples: Industry associations, chambers of commerce, professional boards, investment
                            clubs, trade organizations
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Professional Background Guidelines */}
            <Card className='border-green-200 bg-green-50/50'>
                <CardContent className='pt-6'>
                    <div className='space-y-3'>
                        <h3 className='font-medium text-green-900'>Professional Information Guidelines</h3>
                        <div className='space-y-2 text-sm text-green-800'>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0' />
                                <span>
                                    <strong>Occupation:</strong> Be specific about the role and industry. This helps
                                    assess the guarantor's financial stability.
                                </span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0' />
                                <span>
                                    <strong>Business Information:</strong> Company details and registration numbers help
                                    verify legitimacy and establish credibility.
                                </span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0' />
                                <span>
                                    <strong>Professional Network:</strong> Industry associations and professional
                                    memberships indicate standing within the business community.
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
