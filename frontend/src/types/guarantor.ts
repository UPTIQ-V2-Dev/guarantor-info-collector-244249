export interface GuarantorFormData {
    guarantor_name: string;
    relationship_to_borrower: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    date_of_birth: string;
    occupation: string;
    employer_or_business: string;
    linkedin_profile?: string;
    company_registration_number?: string;
    known_associations: string[];
    comments?: string;
    phone?: string;
    email?: string;
}

export interface GuarantorRecord extends GuarantorFormData {
    id: string;
    submission_timestamp: string;
    submitted_by: string;
    record_status: 'pending_verification' | 'verified' | 'rejected';
    attachments?: FileAttachment[];
}

export interface FileAttachment {
    id: string;
    filename: string;
    file_type: string;
    file_size: number;
    upload_date: string;
}

export type CreateGuarantorInput = GuarantorFormData;

export interface UpdateGuarantorInput extends Partial<GuarantorFormData> {
    id: string;
}

export interface GuarantorFilters {
    search?: string;
    status?: GuarantorRecord['record_status'];
    submitted_by?: string;
    date_from?: string;
    date_to?: string;
}

export interface GuarantorStats {
    total: number;
    pending_verification: number;
    verified: number;
    rejected: number;
}
