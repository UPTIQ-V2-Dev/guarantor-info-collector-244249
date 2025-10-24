import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { GuarantorRecord, GuarantorStats, FileAttachment } from '@/types/guarantor';

export const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: 2,
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'ADMIN',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    data: mockUsers,
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 2
    }
};

// Mock file attachments
export const mockFileAttachments: FileAttachment[] = [
    {
        id: 'att1',
        filename: 'drivers_license.pdf',
        file_type: 'application/pdf',
        file_size: 256000,
        upload_date: '2024-01-15T10:30:00Z'
    },
    {
        id: 'att2',
        filename: 'business_certificate.jpg',
        file_type: 'image/jpeg',
        file_size: 512000,
        upload_date: '2024-01-15T10:35:00Z'
    }
];

// Mock guarantor records
export const mockGuarantorRecords: GuarantorRecord[] = [
    {
        id: '1',
        guarantor_name: 'Michael R. Davis',
        relationship_to_borrower: 'Personal guarantor for BlueRock Holdings LLC',
        address: {
            street: '123 Main Street',
            city: 'Phoenix',
            state: 'AZ',
            zip: '85001'
        },
        date_of_birth: '1978-03-22',
        occupation: 'Real Estate Investor',
        employer_or_business: 'Davis Capital Group',
        linkedin_profile: 'https://www.linkedin.com/in/michaeldavis',
        company_registration_number: 'EIN-123456789',
        known_associations: ['Phoenix Real Estate Association', 'Arizona Investors Network'],
        comments: "Primary contact for borrower's credit line renewal.",
        phone: '+1-602-555-0123',
        email: 'michael.davis@daviscapital.com',
        submission_timestamp: '2024-01-15T10:30:00Z',
        submitted_by: 'LoanOfficer123',
        record_status: 'pending_verification',
        attachments: mockFileAttachments
    },
    {
        id: '2',
        guarantor_name: 'Sarah Johnson',
        relationship_to_borrower: 'Business co-owner',
        address: {
            street: '456 Oak Avenue',
            city: 'Scottsdale',
            state: 'AZ',
            zip: '85251'
        },
        date_of_birth: '1985-07-12',
        occupation: 'Tech Entrepreneur',
        employer_or_business: 'Johnson Tech Solutions',
        linkedin_profile: 'https://www.linkedin.com/in/sarahjohnsontech',
        company_registration_number: 'EIN-987654321',
        known_associations: ['Arizona Tech Council'],
        comments: 'Co-founder with strong credit history.',
        phone: '+1-480-555-0456',
        email: 'sarah@johnsontech.com',
        submission_timestamp: '2024-01-14T14:20:00Z',
        submitted_by: 'LoanOfficer456',
        record_status: 'verified',
        attachments: []
    },
    {
        id: '3',
        guarantor_name: 'Robert Chen',
        relationship_to_borrower: 'Family member and business advisor',
        address: {
            street: '789 Desert Ridge Blvd',
            city: 'Tempe',
            state: 'AZ',
            zip: '85284'
        },
        date_of_birth: '1975-11-08',
        occupation: 'Financial Consultant',
        employer_or_business: 'Chen Financial Advisory',
        linkedin_profile: 'https://www.linkedin.com/in/robertchen',
        known_associations: ['Arizona CPA Society', 'Financial Planning Association'],
        comments: 'Experienced financial advisor with excellent credit.',
        phone: '+1-623-555-0789',
        email: 'robert.chen@chenfinancial.com',
        submission_timestamp: '2024-01-13T09:15:00Z',
        submitted_by: 'LoanOfficer789',
        record_status: 'verified'
    },
    {
        id: '4',
        guarantor_name: 'Lisa Williams',
        relationship_to_borrower: 'Investment partner',
        address: {
            street: '321 Central Park Dr',
            city: 'Mesa',
            state: 'AZ',
            zip: '85202'
        },
        date_of_birth: '1982-04-17',
        occupation: 'Investment Manager',
        employer_or_business: 'Williams Investment Group',
        linkedin_profile: 'https://www.linkedin.com/in/lisawilliamsinvest',
        company_registration_number: 'EIN-456789123',
        known_associations: ['Arizona Investment Club'],
        comments: 'Needs additional documentation for verification.',
        phone: '+1-602-555-0321',
        email: 'lisa@williamsinvest.com',
        submission_timestamp: '2024-01-12T16:45:00Z',
        submitted_by: 'LoanOfficer123',
        record_status: 'rejected'
    }
];

export const mockGuarantorStats: GuarantorStats = {
    total: 4,
    pending_verification: 1,
    verified: 2,
    rejected: 1
};

export const mockPaginatedGuarantors: PaginatedResponse<GuarantorRecord> = {
    data: mockGuarantorRecords,
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 4
    }
};
