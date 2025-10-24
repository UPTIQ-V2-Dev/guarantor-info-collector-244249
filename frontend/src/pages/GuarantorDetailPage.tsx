import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGuarantor, useVerifyGuarantor, useDeleteGuarantor } from '@/hooks/useGuarantors';
import { useGuarantorFiles, useDownloadFile } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    ArrowLeft,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    User,
    MapPin,
    Briefcase,
    Phone,
    Mail,
    Linkedin,
    Download,
    FileText,
    Image,
    File,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize, getFileTypeIcon } from '@/services/fileService';

export const GuarantorDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: guarantor, isLoading, error } = useGuarantor(id!);
    const { data: files = [] } = useGuarantorFiles(id!);
    const verifyMutation = useVerifyGuarantor();
    const deleteMutation = useDeleteGuarantor();
    const downloadMutation = useDownloadFile();

    const handleEdit = () => {
        navigate(`/guarantor/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this guarantor record? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(id!);
            toast.success('Guarantor record deleted successfully');
            navigate('/guarantors');
        } catch {
            toast.error('Failed to delete guarantor record');
        }
    };

    const handleVerify = async () => {
        try {
            await verifyMutation.mutateAsync(id!);
            toast.success('Guarantor verification initiated');
        } catch {
            toast.error('Failed to initiate verification');
        }
    };

    const handleDownload = (fileId: string, filename: string) => {
        downloadMutation.mutate({
            guarantorId: id!,
            fileId,
            filename
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending_verification':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckCircle size={16} />;
            case 'pending_verification':
                return <Clock size={16} />;
            case 'rejected':
                return <XCircle size={16} />;
            default:
                return null;
        }
    };

    const getFileIcon = (fileType: string) => {
        const iconType = getFileTypeIcon(fileType);
        switch (iconType) {
            case 'image':
                return <Image size={16} />;
            case 'file-text':
                return <FileText size={16} />;
            default:
                return <File size={16} />;
        }
    };

    if (isLoading) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <div className='flex items-center gap-4 mb-8'>
                    <Skeleton className='h-10 w-20' />
                    <div className='space-y-2'>
                        <Skeleton className='h-8 w-64' />
                        <Skeleton className='h-4 w-48' />
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2 space-y-6'>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-6 w-32' />
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-3/4' />
                                <Skeleton className='h-4 w-1/2' />
                            </CardContent>
                        </Card>
                    </div>
                    <div className='space-y-6'>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-6 w-24' />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className='h-8 w-32' />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !guarantor) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Alert variant='destructive'>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                        Failed to load guarantor information. The record may not exist or there was an error loading the
                        data.
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
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='flex items-start justify-between mb-8'>
                <div className='flex items-center gap-4'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => navigate('/guarantors')}
                        className='gap-2'
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{guarantor.guarantor_name}</h1>
                        <p className='text-muted-foreground mt-1'>{guarantor.relationship_to_borrower}</p>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <Badge
                        variant='secondary'
                        className={`gap-2 ${getStatusColor(guarantor.record_status)}`}
                    >
                        {getStatusIcon(guarantor.record_status)}
                        {guarantor.record_status.replace('_', ' ')}
                    </Badge>

                    <div className='flex gap-2'>
                        <Button
                            onClick={handleEdit}
                            variant='outline'
                            className='gap-2'
                        >
                            <Edit size={16} />
                            Edit
                        </Button>

                        {guarantor.record_status === 'pending_verification' && (
                            <Button
                                onClick={handleVerify}
                                disabled={verifyMutation.isPending}
                                className='gap-2'
                            >
                                <CheckCircle size={16} />
                                Verify
                            </Button>
                        )}

                        <Button
                            onClick={handleDelete}
                            variant='destructive'
                            disabled={deleteMutation.isPending}
                            className='gap-2'
                        >
                            <Trash2 size={16} />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Main Information */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <User size={20} />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>Full Name</label>
                                    <p className='mt-1'>{guarantor.guarantor_name}</p>
                                </div>
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>Date of Birth</label>
                                    <p className='mt-1'>{new Date(guarantor.date_of_birth).toLocaleDateString()}</p>
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='text-sm font-medium text-muted-foreground'>
                                        Relationship to Borrower
                                    </label>
                                    <p className='mt-1'>{guarantor.relationship_to_borrower}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <MapPin size={20} />
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <p>{guarantor.address.street}</p>
                                <p>
                                    {guarantor.address.city}, {guarantor.address.state} {guarantor.address.zip}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Briefcase size={20} />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>Occupation</label>
                                    <p className='mt-1'>{guarantor.occupation}</p>
                                </div>
                                {guarantor.employer_or_business && (
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>
                                            Employer/Business
                                        </label>
                                        <p className='mt-1'>{guarantor.employer_or_business}</p>
                                    </div>
                                )}
                                {guarantor.company_registration_number && (
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>
                                            Registration Number
                                        </label>
                                        <p className='mt-1'>{guarantor.company_registration_number}</p>
                                    </div>
                                )}
                            </div>

                            {guarantor.known_associations && guarantor.known_associations.length > 0 && (
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>
                                        Professional Associations
                                    </label>
                                    <div className='mt-2 flex flex-wrap gap-2'>
                                        {guarantor.known_associations.map((association, index) => (
                                            <Badge
                                                key={index}
                                                variant='outline'
                                            >
                                                {association}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    {(guarantor.phone || guarantor.email || guarantor.linkedin_profile) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Phone size={20} />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {guarantor.phone && (
                                        <div className='flex items-center gap-2'>
                                            <Phone
                                                size={16}
                                                className='text-muted-foreground'
                                            />
                                            <a
                                                href={`tel:${guarantor.phone}`}
                                                className='hover:underline'
                                            >
                                                {guarantor.phone}
                                            </a>
                                        </div>
                                    )}
                                    {guarantor.email && (
                                        <div className='flex items-center gap-2'>
                                            <Mail
                                                size={16}
                                                className='text-muted-foreground'
                                            />
                                            <a
                                                href={`mailto:${guarantor.email}`}
                                                className='hover:underline'
                                            >
                                                {guarantor.email}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {guarantor.linkedin_profile && (
                                    <div className='flex items-center gap-2'>
                                        <Linkedin
                                            size={16}
                                            className='text-muted-foreground'
                                        />
                                        <a
                                            href={guarantor.linkedin_profile}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='hover:underline text-blue-600'
                                        >
                                            LinkedIn Profile
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Comments */}
                    {guarantor.comments && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='whitespace-pre-wrap'>{guarantor.comments}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className='space-y-6'>
                    {/* Submission Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission Details</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Submitted Date</label>
                                <p className='mt-1'>{new Date(guarantor.submission_timestamp).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Submitted By</label>
                                <p className='mt-1'>{guarantor.submitted_by}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Record ID</label>
                                <p className='mt-1 font-mono text-sm'>{guarantor.id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attachments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <FileText size={20} />
                                Attachments ({files.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.length > 0 ? (
                                <div className='space-y-3'>
                                    {files.map(file => (
                                        <div
                                            key={file.id}
                                            className='flex items-center gap-3 p-3 rounded-lg border'
                                        >
                                            <div className='flex-shrink-0'>{getFileIcon(file.file_type)}</div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-sm font-medium truncate'>{file.filename}</p>
                                                <p className='text-xs text-muted-foreground'>
                                                    {formatFileSize(file.file_size)} •{' '}
                                                    {new Date(file.upload_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                onClick={() => handleDownload(file.id, file.filename)}
                                                disabled={downloadMutation.isPending}
                                            >
                                                <Download size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-sm text-muted-foreground text-center py-4'>
                                    No attachments uploaded
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            <Button
                                onClick={handleEdit}
                                className='w-full gap-2'
                            >
                                <Edit size={16} />
                                Edit Information
                            </Button>

                            {guarantor.record_status === 'pending_verification' && (
                                <Button
                                    onClick={handleVerify}
                                    variant='outline'
                                    disabled={verifyMutation.isPending}
                                    className='w-full gap-2'
                                >
                                    <CheckCircle size={16} />
                                    Start Verification
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
