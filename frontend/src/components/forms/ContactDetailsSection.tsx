import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContactDetailsSectionProps {
    form: UseFormReturn<any>;
}

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({ form }) => {
    const formatPhoneNumber = (value: string) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');

        // Format as (XXX) XXX-XXXX
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }

        // For numbers with country code
        if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        }

        return value;
    };

    return (
        <div className='space-y-6'>
            <Alert>
                <Info className='h-4 w-4' />
                <AlertDescription>
                    Contact information helps us verify the guarantor's identity and reach them if needed. While not
                    strictly required, providing accurate contact details expedites the verification process.
                </AlertDescription>
            </Alert>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Phone Number */}
                <Card>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-base flex items-center gap-2'>
                            <Phone size={16} />
                            Phone Number
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='tel'
                                            placeholder='+1 (555) 123-4567'
                                            {...field}
                                            className='h-11'
                                            onChange={e => {
                                                const formatted = formatPhoneNumber(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Primary contact number for verification</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Email Address */}
                <Card>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-base flex items-center gap-2'>
                            <Mail size={16} />
                            Email Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='guarantor@example.com'
                                            {...field}
                                            className='h-11'
                                            onChange={e => {
                                                // Convert to lowercase for consistency
                                                field.onChange(e.target.value.toLowerCase());
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Business or personal email for correspondence</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Contact Verification Info */}
            <Card className='border-blue-200 bg-blue-50/50'>
                <CardContent className='pt-6'>
                    <div className='space-y-3'>
                        <h3 className='font-medium text-blue-900'>Contact Information Guidelines</h3>
                        <div className='space-y-2 text-sm text-blue-800'>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>
                                    <strong>Phone:</strong> Provide the guarantor's direct line when possible. Cell
                                    phone numbers are preferred for faster verification.
                                </span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>
                                    <strong>Email:</strong> Business email addresses carry more weight in verification.
                                    Avoid temporary or disposable email services.
                                </span>
                            </div>
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' />
                                <span>
                                    <strong>Privacy:</strong> Contact information is encrypted and used solely for
                                    verification purposes. It will not be shared without consent.
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
