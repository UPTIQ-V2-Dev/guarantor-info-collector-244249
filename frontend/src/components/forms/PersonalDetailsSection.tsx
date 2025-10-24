import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PersonalDetailsSectionProps {
    form: UseFormReturn<any>;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({ form }) => {
    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Full Name */}
                <FormField
                    control={form.control}
                    name='guarantor_name'
                    render={({ field }) => (
                        <FormItem className='md:col-span-2'>
                            <FormLabel className='required'>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter guarantor's full legal name"
                                    {...field}
                                    className='h-11'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date of Birth */}
                <FormField
                    control={form.control}
                    name='date_of_birth'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='required'>Date of Birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant='outline'
                                            className={cn(
                                                'w-full h-11 text-left font-normal justify-start',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value
                                                ? format(new Date(field.value), 'PPP')
                                                : 'Select date of birth'}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className='w-auto p-0'
                                    align='start'
                                >
                                    <Calendar
                                        mode='single'
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={date => {
                                            if (date) {
                                                field.onChange(format(date, 'yyyy-MM-dd'));
                                            }
                                        }}
                                        disabled={date => date > new Date() || date < new Date('1900-01-01')}
                                        initialFocus
                                        captionLayout='dropdown'
                                        fromYear={1930}
                                        toYear={new Date().getFullYear()}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Required for identity verification</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Relationship to Borrower */}
                <FormField
                    control={form.control}
                    name='relationship_to_borrower'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='required'>Relationship to Borrower</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='e.g., Business Partner, Family Member'
                                    {...field}
                                    className='h-11'
                                />
                            </FormControl>
                            <FormDescription>Describe the guarantor's relationship to the borrower</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Address Section */}
            <Card>
                <CardContent className='pt-6'>
                    <h3 className='text-lg font-medium mb-4'>Address Information</h3>
                    <div className='space-y-4'>
                        {/* Street Address */}
                        <FormField
                            control={form.control}
                            name='address.street'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='required'>Street Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='123 Main Street, Apt 4B'
                                            {...field}
                                            className='h-11'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {/* City */}
                            <FormField
                                control={form.control}
                                name='address.city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='required'>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Phoenix'
                                                {...field}
                                                className='h-11'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* State */}
                            <FormField
                                control={form.control}
                                name='address.state'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='required'>State</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='AZ'
                                                {...field}
                                                maxLength={2}
                                                className='h-11'
                                                onChange={e => field.onChange(e.target.value.toUpperCase())}
                                            />
                                        </FormControl>
                                        <FormDescription>2-letter state code</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ZIP Code */}
                            <FormField
                                control={form.control}
                                name='address.zip'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='required'>ZIP Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='85001'
                                                {...field}
                                                className='h-11'
                                                pattern='[0-9]{5}(-[0-9]{4})?'
                                            />
                                        </FormControl>
                                        <FormDescription>5-digit ZIP or ZIP+4</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Comments */}
            <FormField
                control={form.control}
                name='comments'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Additional Comments</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder='Any additional notes about this guarantor...'
                                className='min-h-[100px] resize-none'
                                maxLength={1000}
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>Optional: Add any relevant notes or special circumstances</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
