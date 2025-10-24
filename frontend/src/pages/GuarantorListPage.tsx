import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuarantors } from '@/hooks/useGuarantors';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, Eye, Edit, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GuarantorFilters } from '@/types/guarantor';

export const GuarantorListPage: React.FC = () => {
    const navigate = useNavigate();

    // State for filtering and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Debounce search term to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Build filters object
    const filters: GuarantorFilters = {
        search: debouncedSearchTerm || undefined,
        status: statusFilter ? (statusFilter as GuarantorFilters['status']) : undefined
    };

    // Fetch guarantors data
    const { data: guarantorsData, isLoading, error } = useGuarantors(filters, currentPage, pageSize);

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
                return <CheckCircle size={14} />;
            case 'pending_verification':
                return <Clock size={14} />;
            case 'rejected':
                return <XCircle size={14} />;
            default:
                return null;
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setCurrentPage(1);
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Guarantor Records</h1>
                    <p className='text-muted-foreground mt-1'>Manage and search all guarantor background checks</p>
                </div>

                <Button
                    onClick={() => navigate('/guarantor/new')}
                    className='gap-2'
                >
                    <Plus size={16} />
                    New Guarantor
                </Button>
            </div>

            {/* Filters */}
            <Card className='mb-6'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Filter size={20} />
                        Search & Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col md:flex-row gap-4'>
                        {/* Search */}
                        <div className='flex-1'>
                            <div className='relative'>
                                <Search
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
                                    size={16}
                                />
                                <Input
                                    placeholder='Search by name, occupation, or relationship...'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className='pl-9'
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className='w-full md:w-48'>
                                <SelectValue placeholder='All Status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All Status</SelectItem>
                                <SelectItem value='pending_verification'>Pending Verification</SelectItem>
                                <SelectItem value='verified'>Verified</SelectItem>
                                <SelectItem value='rejected'>Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        {(searchTerm || statusFilter) && (
                            <Button
                                variant='outline'
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <CardTitle>
                            {guarantorsData ? `${guarantorsData.pagination.total} Guarantors` : 'Guarantors'}
                        </CardTitle>
                        {guarantorsData && guarantorsData.pagination.total > 0 && (
                            <div className='text-sm text-muted-foreground'>
                                Page {guarantorsData.pagination.page} of {guarantorsData.pagination.totalPages}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className='text-center py-8'>
                            <p className='text-destructive mb-4'>Failed to load guarantors</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant='outline'
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : isLoading ? (
                        <div className='space-y-4'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className='flex items-center gap-4 p-4 border rounded-lg'
                                >
                                    <Skeleton className='w-12 h-12 rounded' />
                                    <div className='space-y-2 flex-1'>
                                        <Skeleton className='h-4 w-48' />
                                        <Skeleton className='h-3 w-64' />
                                    </div>
                                    <Skeleton className='h-6 w-20' />
                                    <Skeleton className='h-8 w-8' />
                                </div>
                            ))}
                        </div>
                    ) : guarantorsData && guarantorsData.data.length > 0 ? (
                        <>
                            <div className='space-y-3'>
                                {guarantorsData.data.map(guarantor => (
                                    <div
                                        key={guarantor.id}
                                        className='flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors'
                                    >
                                        <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <span className='text-sm font-medium text-primary'>
                                                {guarantor.guarantor_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium truncate'>{guarantor.guarantor_name}</h3>
                                            <div className='text-sm text-muted-foreground space-y-1'>
                                                <p className='truncate'>{guarantor.relationship_to_borrower}</p>
                                                <div className='flex items-center gap-4'>
                                                    <span>{guarantor.occupation}</span>
                                                    <span>•</span>
                                                    <span>
                                                        {guarantor.address.city}, {guarantor.address.state}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {new Date(guarantor.submission_timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <Badge
                                                variant='secondary'
                                                className={`gap-1 ${getStatusColor(guarantor.record_status)}`}
                                            >
                                                {getStatusIcon(guarantor.record_status)}
                                                {guarantor.record_status.replace('_', ' ')}
                                            </Badge>

                                            <div className='flex gap-1'>
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    onClick={() => navigate(`/guarantor/${guarantor.id}`)}
                                                    title='View Details'
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    onClick={() => navigate(`/guarantor/${guarantor.id}/edit`)}
                                                    title='Edit'
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {guarantorsData.pagination.totalPages > 1 && (
                                <div className='flex items-center justify-between mt-6 pt-6 border-t'>
                                    <div className='text-sm text-muted-foreground'>
                                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                                        {Math.min(currentPage * pageSize, guarantorsData.pagination.total)} of{' '}
                                        {guarantorsData.pagination.total} results
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className='gap-1'
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </Button>

                                        <div className='flex items-center gap-1'>
                                            {Array.from(
                                                { length: guarantorsData.pagination.totalPages },
                                                (_, i) => i + 1
                                            )
                                                .filter(
                                                    page =>
                                                        page === 1 ||
                                                        page === guarantorsData.pagination.totalPages ||
                                                        Math.abs(page - currentPage) <= 1
                                                )
                                                .map((page, index, array) => (
                                                    <React.Fragment key={page}>
                                                        {index > 0 && array[index - 1] < page - 1 && (
                                                            <span className='px-2 text-muted-foreground'>...</span>
                                                        )}
                                                        <Button
                                                            variant={page === currentPage ? 'default' : 'outline'}
                                                            size='sm'
                                                            onClick={() => handlePageChange(page)}
                                                            className='w-8 h-8 p-0'
                                                        >
                                                            {page}
                                                        </Button>
                                                    </React.Fragment>
                                                ))}
                                        </div>

                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === guarantorsData.pagination.totalPages}
                                            className='gap-1'
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Search
                                    size={24}
                                    className='text-muted-foreground'
                                />
                            </div>
                            <h3 className='text-lg font-medium mb-2'>No guarantors found</h3>
                            <p className='text-muted-foreground mb-6'>
                                {searchTerm || statusFilter
                                    ? 'Try adjusting your search criteria or filters'
                                    : 'Get started by creating your first guarantor record'}
                            </p>
                            {!searchTerm && !statusFilter && (
                                <Button
                                    onClick={() => navigate('/guarantor/new')}
                                    className='gap-2'
                                >
                                    <Plus size={16} />
                                    New Guarantor
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
