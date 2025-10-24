import type { GuarantorRecord, GuarantorFormData, FileAttachment } from '@/types/guarantor';

export const mockGuarantorFormData: GuarantorFormData = {
    guarantor_name: 'John Doe',
    relationship_to_borrower: 'Business Partner',
    address: {
        street: '123 Test Street',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85001'
    },
    date_of_birth: '1980-01-15',
    occupation: 'Software Engineer',
    employer_or_business: 'Tech Solutions Inc',
    linkedin_profile: 'https://www.linkedin.com/in/johndoe',
    company_registration_number: 'EIN-123456789',
    known_associations: ['Tech Association', 'Business Network'],
    comments: 'Reliable guarantor with strong credit history',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com'
};

export const mockGuarantorRecord: GuarantorRecord = {
    ...mockGuarantorFormData,
    id: 'test-guarantor-1',
    submission_timestamp: '2024-01-15T10:30:00Z',
    submitted_by: 'TestUser',
    record_status: 'pending_verification',
    attachments: []
};

export const mockVerifiedGuarantorRecord: GuarantorRecord = {
    ...mockGuarantorRecord,
    id: 'test-guarantor-2',
    guarantor_name: 'Jane Smith',
    record_status: 'verified'
};

export const mockRejectedGuarantorRecord: GuarantorRecord = {
    ...mockGuarantorRecord,
    id: 'test-guarantor-3',
    guarantor_name: 'Bob Johnson',
    record_status: 'rejected'
};

export const mockFileAttachment: FileAttachment = {
    id: 'file-1',
    filename: 'identification.pdf',
    file_type: 'application/pdf',
    file_size: 1024000,
    upload_date: '2024-01-15T10:35:00Z'
};

export const mockGuarantorWithFiles: GuarantorRecord = {
    ...mockGuarantorRecord,
    id: 'test-guarantor-with-files',
    attachments: [mockFileAttachment]
};

export const mockGuarantorList: GuarantorRecord[] = [
    mockGuarantorRecord,
    mockVerifiedGuarantorRecord,
    mockRejectedGuarantorRecord,
    mockGuarantorWithFiles
];
