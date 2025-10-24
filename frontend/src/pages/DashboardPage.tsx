import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuarantorStats, useRecentGuarantors } from '@/hooks/useGuarantors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Clock, CheckCircle, XCircle, Eye, TrendingUp, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: stats, isLoading: statsLoading } = useGuarantorStats();
    const { data: recentGuarantors, isLoading: recentLoading } = useRecentGuarantors(5);

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

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Guarantor Dashboard</h1>
                    <p className='text-muted-foreground mt-1'>Manage and track guarantor background information</p>
                </div>

                <div className='flex gap-3'>
                    <Button
                        onClick={() => navigate('/guarantors')}
                        variant='outline'
                        className='gap-2'
                    >
                        <Users size={16} />
                        View All Guarantors
                    </Button>
                    <Button
                        onClick={() => navigate('/guarantor/new')}
                        className='gap-2'
                    >
                        <Plus size={16} />
                        New Guarantor
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {statsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='h-4 w-4' />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className='h-8 w-16 mb-1' />
                                <Skeleton className='h-3 w-32' />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Total Guarantors</CardTitle>
                                <Users className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{stats?.total || 0}</div>
                                <p className='text-xs text-muted-foreground'>All guarantor records</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Pending Verification</CardTitle>
                                <Clock className='h-4 w-4 text-yellow-600' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold text-yellow-600'>
                                    {stats?.pending_verification || 0}
                                </div>
                                <p className='text-xs text-muted-foreground'>Awaiting background check</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Verified</CardTitle>
                                <CheckCircle className='h-4 w-4 text-green-600' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold text-green-600'>{stats?.verified || 0}</div>
                                <p className='text-xs text-muted-foreground'>Successfully verified</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Rejected</CardTitle>
                                <XCircle className='h-4 w-4 text-red-600' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold text-red-600'>{stats?.rejected || 0}</div>
                                <p className='text-xs text-muted-foreground'>Verification failed</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Recent Submissions */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <TrendingUp size={20} />
                            Recent Submissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentLoading ? (
                            <div className='space-y-3'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className='flex items-center gap-3'
                                    >
                                        <Skeleton className='w-10 h-10 rounded' />
                                        <div className='space-y-1 flex-1'>
                                            <Skeleton className='h-4 w-32' />
                                            <Skeleton className='h-3 w-24' />
                                        </div>
                                        <Skeleton className='h-6 w-16' />
                                    </div>
                                ))}
                            </div>
                        ) : recentGuarantors && recentGuarantors.length > 0 ? (
                            <div className='space-y-4'>
                                {recentGuarantors.map(guarantor => (
                                    <div
                                        key={guarantor.id}
                                        className='flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors'
                                        onClick={() => navigate(`/guarantor/${guarantor.id}`)}
                                    >
                                        <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <FileText
                                                size={16}
                                                className='text-primary'
                                            />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-sm truncate'>{guarantor.guarantor_name}</p>
                                            <p className='text-xs text-muted-foreground'>
                                                {new Date(guarantor.submission_timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Badge
                                                variant='secondary'
                                                className={`text-xs gap-1 ${getStatusColor(guarantor.record_status)}`}
                                            >
                                                {getStatusIcon(guarantor.record_status)}
                                                {guarantor.record_status.replace('_', ' ')}
                                            </Badge>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='h-8 w-8 p-0'
                                            >
                                                <Eye size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <div className='pt-2'>
                                    <Button
                                        variant='outline'
                                        className='w-full'
                                        onClick={() => navigate('/guarantors')}
                                    >
                                        View All Guarantors
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className='text-center py-8'>
                                <FileText className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                                <p className='text-muted-foreground mb-4'>No guarantor submissions yet</p>
                                <Button
                                    onClick={() => navigate('/guarantor/new')}
                                    className='gap-2'
                                >
                                    <Plus size={16} />
                                    Create First Guarantor
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <Button
                            className='w-full justify-start gap-3 h-auto p-4'
                            onClick={() => navigate('/guarantor/new')}
                        >
                            <div className='w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center'>
                                <Plus size={20} />
                            </div>
                            <div className='text-left'>
                                <div className='font-medium'>New Guarantor</div>
                                <div className='text-sm opacity-80'>Start a new background check</div>
                            </div>
                        </Button>

                        <Button
                            variant='outline'
                            className='w-full justify-start gap-3 h-auto p-4'
                            onClick={() => navigate('/guarantors')}
                        >
                            <div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center'>
                                <Users size={20} />
                            </div>
                            <div className='text-left'>
                                <div className='font-medium'>View All Guarantors</div>
                                <div className='text-sm text-muted-foreground'>Browse and search records</div>
                            </div>
                        </Button>

                        <Button
                            variant='outline'
                            className='w-full justify-start gap-3 h-auto p-4'
                            onClick={() => {
                                // In a real app, this would trigger export functionality
                                alert('Export functionality would be implemented here');
                            }}
                        >
                            <div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center'>
                                <FileText size={20} />
                            </div>
                            <div className='text-left'>
                                <div className='font-medium'>Export Reports</div>
                                <div className='text-sm text-muted-foreground'>Download guarantor data</div>
                            </div>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
