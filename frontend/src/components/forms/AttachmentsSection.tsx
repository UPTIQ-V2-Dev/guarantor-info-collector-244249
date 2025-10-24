import React, { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Image, X, Download, AlertCircle, CheckCircle, File } from 'lucide-react';
import { useUploadFiles, useGuarantorFiles, useDownloadFile, useDeleteFile } from '@/hooks/useFileUpload';
import { validateFile, formatFileSize, getFileTypeIcon } from '@/services/fileService';
import { cn } from '@/lib/utils';

interface AttachmentsSectionProps {
    form: UseFormReturn<any>;
    guarantorId?: string;
}

interface FileWithValidation extends File {
    validation: { isValid: boolean; error?: string };
    id?: string;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ form, guarantorId }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithValidation[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    // Hooks for file operations
    const uploadFilesMutation = useUploadFiles(guarantorId || 'temp');
    const downloadFileMutation = useDownloadFile();
    const deleteFileMutation = useDeleteFile(guarantorId || 'temp');
    const { data: existingFiles = [] } = useGuarantorFiles(guarantorId || 'temp');

    const handleFileSelect = useCallback((files: File[]) => {
        const validatedFiles: FileWithValidation[] = files.map(file => ({
            ...file,
            validation: validateFile(file)
        }));

        setSelectedFiles(prev => [...prev, ...validatedFiles]);
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(Array.from(e.dataTransfer.files));
            }
        },
        [handleFileSelect]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(Array.from(e.target.files));
            e.target.value = ''; // Reset input
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        const validFiles = selectedFiles.filter(f => f.validation.isValid);
        if (validFiles.length === 0) return;

        try {
            setUploadProgress(0);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            await uploadFilesMutation.mutateAsync(validFiles);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Clear selected files after successful upload
            setTimeout(() => {
                setSelectedFiles([]);
                setUploadProgress(0);
            }, 1000);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadProgress(0);
        }
    };

    const downloadFile = (fileId: string, filename: string) => {
        if (!guarantorId) return;

        downloadFileMutation.mutate({
            guarantorId,
            fileId,
            filename
        });
    };

    const deleteFile = async (fileId: string) => {
        if (!guarantorId) return;

        try {
            await deleteFileMutation.mutateAsync(fileId);
        } catch (error) {
            console.error('Delete failed:', error);
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

    return (
        <div className='space-y-6'>
            {/* File Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Upload size={20} />
                        Upload Supporting Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                            dragActive ? 'border-primary bg-primary/5' : 'border-border',
                            'hover:border-primary/50 hover:bg-primary/5'
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                        <div className='space-y-2'>
                            <p className='text-lg font-medium'>Drop files here or click to upload</p>
                            <p className='text-sm text-muted-foreground'>
                                Supported: Images, PDFs, Documents (Max 10MB each)
                            </p>
                        </div>
                        <Button
                            type='button'
                            variant='outline'
                            className='mt-4'
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            Choose Files
                        </Button>
                        <input
                            id='file-upload'
                            type='file'
                            multiple
                            accept='.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt'
                            onChange={handleFileInput}
                            className='hidden'
                        />
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress > 0 && (
                        <div className='mt-4'>
                            <div className='flex justify-between text-sm mb-2'>
                                <span>Uploading files...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Selected Files (before upload) */}
            {selectedFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className='flex justify-between items-center'>
                            <CardTitle>Selected Files</CardTitle>
                            <Button
                                onClick={uploadFiles}
                                disabled={
                                    !selectedFiles.some(f => f.validation.isValid) || uploadFilesMutation.isPending
                                }
                                className='gap-2'
                            >
                                <Upload size={16} />
                                Upload {selectedFiles.filter(f => f.validation.isValid).length} Files
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg border',
                                        file.validation.isValid
                                            ? 'border-green-200 bg-green-50/50'
                                            : 'border-red-200 bg-red-50/50'
                                    )}
                                >
                                    <div className='flex-shrink-0'>{getFileIcon(file.type)}</div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-medium truncate'>{file.name}</p>
                                        <p className='text-xs text-muted-foreground'>{formatFileSize(file.size)}</p>
                                        {!file.validation.isValid && (
                                            <p className='text-xs text-red-600 mt-1'>{file.validation.error}</p>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        {file.validation.isValid ? (
                                            <CheckCircle
                                                size={16}
                                                className='text-green-600'
                                            />
                                        ) : (
                                            <AlertCircle
                                                size={16}
                                                className='text-red-600'
                                            />
                                        )}
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => removeSelectedFile(index)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Existing Files */}
            {existingFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Uploaded Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            {existingFiles.map(file => (
                                <div
                                    key={file.id}
                                    className='flex items-center gap-3 p-3 rounded-lg border'
                                >
                                    <div className='flex-shrink-0'>{getFileIcon(file.file_type)}</div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-medium truncate'>{file.filename}</p>
                                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                            <span>{formatFileSize(file.file_size)}</span>
                                            <span>•</span>
                                            <span>{new Date(file.upload_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => downloadFile(file.id, file.filename)}
                                            disabled={downloadFileMutation.isPending}
                                        >
                                            <Download size={16} />
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => deleteFile(file.id)}
                                            disabled={deleteFileMutation.isPending}
                                            className='text-destructive hover:text-destructive'
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Document Guidelines */}
            <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                    <div className='space-y-2'>
                        <p>
                            <strong>Recommended Documents:</strong>
                        </p>
                        <ul className='text-sm space-y-1 ml-4'>
                            <li>• Government-issued ID (Driver's License, Passport)</li>
                            <li>• Proof of address (Utility bill, Bank statement)</li>
                            <li>• Business registration or incorporation documents</li>
                            <li>• Financial statements or tax returns (if applicable)</li>
                        </ul>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
};
