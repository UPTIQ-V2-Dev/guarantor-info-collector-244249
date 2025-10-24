import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { DashboardPage } from '@/pages/DashboardPage';
import { GuarantorFormPage } from '@/pages/GuarantorFormPage';
import { GuarantorListPage } from '@/pages/GuarantorListPage';
import { GuarantorDetailPage } from '@/pages/GuarantorDetailPage';

// Create query client with default options
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error: any) => {
                // Don't retry on 404s or 401s
                if (error?.response?.status === 404 || error?.response?.status === 401) {
                    return false;
                }
                return failureCount < 3;
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000 // 10 minutes (formerly cacheTime)
        },
        mutations: {
            retry: false
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className='min-h-screen bg-background'>
                    <Routes>
                        {/* Dashboard - Home page */}
                        <Route
                            path='/'
                            element={<DashboardPage />}
                        />

                        {/* Guarantor Routes */}
                        <Route
                            path='/guarantors'
                            element={<GuarantorListPage />}
                        />
                        <Route
                            path='/guarantor/new'
                            element={<GuarantorFormPage />}
                        />
                        <Route
                            path='/guarantor/:id'
                            element={<GuarantorDetailPage />}
                        />
                        <Route
                            path='/guarantor/:id/edit'
                            element={<GuarantorFormPage />}
                        />

                        {/* Catch all route - redirect to dashboard */}
                        <Route
                            path='*'
                            element={
                                <Navigate
                                    to='/'
                                    replace
                                />
                            }
                        />
                    </Routes>

                    {/* Toast notifications */}
                    <Toaster
                        position='top-right'
                        richColors
                    />
                </div>
            </Router>
        </QueryClientProvider>
    );
};
