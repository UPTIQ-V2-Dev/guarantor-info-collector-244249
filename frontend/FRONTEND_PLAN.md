# Guarantor Background Information Collector - Frontend Implementation Plan

## Technology Stack

- **React 19** with TypeScript
- **Vite** as build tool
- **ShadCN/UI** components with **Tailwind CSS v4**
- **React Hook Form** with **Zod** validation
- **TanStack Query** for API state management
- **Axios** for HTTP requests
- **React Router DOM** for navigation

## Application Architecture

### Core Pages & Routes

#### 1. Dashboard Page (`/`)

**Components:**

- `src/pages/DashboardPage.tsx` - Main dashboard layout
- `src/components/dashboard/RecentSubmissions.tsx` - Recent guarantor submissions table
- `src/components/dashboard/StatsCards.tsx` - Summary statistics cards
- `src/components/dashboard/QuickActions.tsx` - Quick action buttons

**Features:**

- Overview of recent submissions
- Statistics (pending, verified, rejected)
- Quick access to create new guarantor record
- Search functionality

**API Endpoints:**

- `GET /api/guarantors/recent` - Recent submissions
- `GET /api/guarantors/stats` - Dashboard statistics

#### 2. Guarantor Form Page (`/guarantor/new`, `/guarantor/:id/edit`)

**Components:**

- `src/pages/GuarantorFormPage.tsx` - Main form container
- `src/components/forms/GuarantorForm.tsx` - Multi-step form wrapper
- `src/components/forms/PersonalDetailsSection.tsx` - Personal info form section
- `src/components/forms/ContactDetailsSection.tsx` - Contact & identity form section
- `src/components/forms/EmploymentSection.tsx` - Employment & business form section
- `src/components/forms/AttachmentsSection.tsx` - File upload section
- `src/components/forms/FormNavigation.tsx` - Multi-step navigation
- `src/components/forms/FormProgress.tsx` - Progress indicator

**Features:**

- Multi-step form with validation
- File upload functionality
- Auto-save draft functionality
- Form field validation with Zod
- Progress tracking

**API Endpoints:**

- `POST /api/guarantors` - Create new guarantor
- `PUT /api/guarantors/:id` - Update existing guarantor
- `POST /api/guarantors/:id/attachments` - Upload files

#### 3. Guarantor List Page (`/guarantors`)

**Components:**

- `src/pages/GuarantorListPage.tsx` - Main list container
- `src/components/guarantor/GuarantorTable.tsx` - Data table with sorting/filtering
- `src/components/guarantor/GuarantorFilters.tsx` - Filter sidebar
- `src/components/guarantor/GuarantorSearch.tsx` - Search functionality
- `src/components/guarantor/StatusBadge.tsx` - Status indicator component

**Features:**

- Searchable and filterable guarantor list
- Pagination
- Bulk actions
- Export functionality

**API Endpoints:**

- `GET /api/guarantors` - List guarantors with filtering/pagination
- `GET /api/guarantors/export` - Export data

#### 4. Guarantor Detail Page (`/guarantor/:id`)

**Components:**

- `src/pages/GuarantorDetailPage.tsx` - Detail view container
- `src/components/guarantor/GuarantorDetails.tsx` - Formatted guarantor information
- `src/components/guarantor/VerificationStatus.tsx` - Verification status panel
- `src/components/guarantor/AttachmentList.tsx` - File attachments display
- `src/components/guarantor/ActionButtons.tsx` - Edit/Delete/Verify actions

**Features:**

- Complete guarantor information view
- Verification status tracking
- Action buttons (edit, delete, verify)
- Attachment viewing

**API Endpoints:**

- `GET /api/guarantors/:id` - Get guarantor details
- `POST /api/guarantors/:id/verify` - Trigger verification process
- `DELETE /api/guarantors/:id` - Delete guarantor record

### Shared Components & Utilities

#### Layout Components

- `src/components/layout/AppLayout.tsx` - Main application layout
- `src/components/layout/Header.tsx` - Application header with navigation
- `src/components/layout/Sidebar.tsx` - Navigation sidebar
- `src/components/layout/Breadcrumb.tsx` - Breadcrumb navigation

#### Common Components

- `src/components/common/LoadingSpinner.tsx` - Loading state component
- `src/components/common/ErrorBoundary.tsx` - Error boundary wrapper
- `src/components/common/ConfirmDialog.tsx` - Confirmation modal
- `src/components/common/FileUpload.tsx` - File upload component
- `src/components/common/DataTable.tsx` - Reusable data table
- `src/components/common/SearchInput.tsx` - Search input with debouncing

#### Form Components

- `src/components/forms/FormField.tsx` - Wrapper for form fields
- `src/components/forms/AddressInput.tsx` - Address input with validation
- `src/components/forms/PhoneInput.tsx` - Phone number input
- `src/components/forms/DatePicker.tsx` - Date selection component

### Types & Data Models

#### Core Types

```typescript
// src/types/guarantor.ts
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
```

#### API Types

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
```

### Services & API Integration

#### API Services

- `src/services/guarantorService.ts` - Guarantor CRUD operations
- `src/services/fileService.ts` - File upload/download operations
- `src/services/validationService.ts` - Data validation utilities

#### Hooks

- `src/hooks/useGuarantors.ts` - Guarantor data management
- `src/hooks/useFormPersistence.ts` - Form auto-save functionality
- `src/hooks/useFileUpload.ts` - File upload management
- `src/hooks/useSearch.ts` - Search and filtering
- `src/hooks/useDebounce.ts` - Debounced input handling

### Validation Schema

#### Zod Schemas

```typescript
// src/schemas/guarantorSchema.ts
export const guarantorSchema = z.object({
    guarantor_name: z.string().min(1, 'Name is required'),
    relationship_to_borrower: z.string().min(1, 'Relationship is required'),
    address: z.object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(2, 'State is required'),
        zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    }),
    date_of_birth: z.string().refine(date => {
        const parsed = new Date(date);
        return parsed instanceof Date && !isNaN(parsed.getTime());
    }, 'Invalid date format'),
    occupation: z.string().min(1, 'Occupation is required'),
    employer_or_business: z.string().optional(),
    linkedin_profile: z.string().url().optional().or(z.literal('')),
    company_registration_number: z.string().optional(),
    known_associations: z.array(z.string()).default([]),
    comments: z.string().optional(),
    phone: z
        .string()
        .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
        .optional(),
    email: z.string().email('Invalid email format').optional()
});
```

### State Management

#### TanStack Query Setup

- `src/lib/queryClient.ts` - Query client configuration
- `src/queries/guarantorQueries.ts` - Guarantor-related queries
- `src/mutations/guarantorMutations.ts` - Guarantor mutations

### Utility Functions

#### Common Utilities

- `src/utils/formatters.ts` - Data formatting functions
- `src/utils/validators.ts` - Custom validation functions
- `src/utils/constants.ts` - Application constants
- `src/utils/storage.ts` - Local storage utilities
- `src/utils/dateUtils.ts` - Date manipulation utilities

### Security & Privacy

#### Data Protection

- Sensitive data masking utilities
- Secure file upload validation
- Input sanitization
- XSS protection measures

---

## Testing Strategy

### Framework & Tools

- **Vitest** - Test runner and framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers
- **MSW (Mock Service Worker)** - API mocking
- **@vitest/coverage-v8** - Code coverage reporting

### Test Organization & Structure

#### Directory Structure

```
src/
├── __tests__/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── __mocks__/
│   ├── handlers/
│   └── fixtures/
└── test/
    ├── setup.ts (existing)
    ├── test-utils.tsx
    ├── mocks/
    └── fixtures/
```

#### Naming Conventions

- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Service tests: `serviceName.test.ts`
- Page tests: `PageName.test.tsx`
- Utils tests: `utilityName.test.ts`

### Unit & Component Testing

#### Page Component Tests

```typescript
// src/__tests__/pages/GuarantorFormPage.test.tsx
describe('GuarantorFormPage', () => {
    it('renders form sections correctly');
    it('validates required fields');
    it('saves form data on submission');
    it('handles API errors gracefully');
    it('persists draft data');
});
```

#### Form Component Tests

```typescript
// src/__tests__/components/forms/GuarantorForm.test.tsx
describe('GuarantorForm', () => {
    it('validates personal details section');
    it('handles multi-step navigation');
    it('displays validation errors');
    it('submits form with valid data');
    it('auto-saves draft on field changes');
});
```

#### Table Component Tests

```typescript
// src/__tests__/components/guarantor/GuarantorTable.test.tsx
describe('GuarantorTable', () => {
    it('renders guarantor list correctly');
    it('handles sorting by columns');
    it('filters data based on search');
    it('navigates to detail page on row click');
    it('handles pagination');
});
```

### Service & API Testing

#### Service Tests with MSW

```typescript
// src/__tests__/services/guarantorService.test.ts
describe('guarantorService', () => {
    beforeEach(() => {
        server.resetHandlers();
    });

    it('creates guarantor record successfully');
    it('handles validation errors from API');
    it('updates existing guarantor');
    it('fetches guarantor list with filters');
    it('handles network errors');
});
```

#### API Mocking Setup

```typescript
// src/__mocks__/handlers/guarantorHandlers.ts
export const guarantorHandlers = [
    rest.post('/api/guarantors', (req, res, ctx) => {
        return res(ctx.json({ success: true, data: mockGuarantorRecord }));
    }),
    rest.get('/api/guarantors', (req, res, ctx) => {
        return res(
            ctx.json({
                data: mockGuarantorList,
                pagination: mockPagination
            })
        );
    })
];
```

### Hook Testing

#### Custom Hook Tests

```typescript
// src/__tests__/hooks/useGuarantors.test.ts
describe('useGuarantors', () => {
    it('fetches guarantors list');
    it('handles loading states');
    it('manages error states');
    it('updates cache on mutation');
    it('refetches on filter changes');
});
```

### Form Validation Testing

#### Zod Schema Tests

```typescript
// src/__tests__/schemas/guarantorSchema.test.ts
describe('guarantorSchema', () => {
    it('validates required fields');
    it('validates email format');
    it('validates phone number format');
    it('validates ZIP code format');
    it('validates date format');
    it('allows optional fields to be empty');
});
```

### Integration Testing

#### End-to-End Workflows

```typescript
// src/__tests__/workflows/guarantorFlow.test.tsx
describe('Guarantor Creation Workflow', () => {
    it('creates guarantor from start to finish');
    it('handles form validation errors');
    it('uploads attachments successfully');
    it('saves and retrieves draft');
    it('navigates between form steps');
});
```

### Test Utilities & Setup

#### Custom Render Function

```typescript
// src/test/test-utils.tsx
export const renderWithProviders = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
```

#### Test Fixtures

```typescript
// src/test/fixtures/guarantor.ts
export const mockGuarantorRecord: GuarantorRecord = {
    id: '1',
    guarantor_name: 'John Doe',
    relationship_to_borrower: 'Business Partner',
    address: {
        street: '123 Main St',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85001'
    }
    // ... other fields
};
```

### Key Test Cases

#### Form Validation

- Required field validation
- Email format validation
- Phone number format validation
- ZIP code validation
- Date format validation
- URL validation for LinkedIn profiles

#### State Transitions

- Loading → Success states
- Loading → Error states
- Form submission states
- File upload progress states
- Search/filter state changes

#### Error Handling

- Network error scenarios
- API validation errors
- File upload failures
- Form submission errors
- Authentication errors

#### User Interactions

- Multi-step form navigation
- File drag-and-drop
- Search and filtering
- Sorting table columns
- Pagination controls

### Coverage Goals

- **Components**: 90%+ coverage
- **Services**: 95%+ coverage
- **Hooks**: 90%+ coverage
- **Utils**: 95%+ coverage

### CI/CD Integration

- Run tests on pull requests
- Coverage reporting
- Failed test notifications
- Performance regression testing

---

## Implementation Phases

### Phase 1: Core Setup & Routing

- Setup routing structure
- Implement basic layout components
- Create type definitions
- Setup API service layer

### Phase 2: Form Implementation

- Build multi-step guarantor form
- Implement form validation
- Add file upload functionality
- Create form persistence

### Phase 3: Data Management

- Implement guarantor list/table
- Add search and filtering
- Create detail view page
- Setup API integration

### Phase 4: Polish & Testing

- Add comprehensive test coverage
- Implement error handling
- Performance optimizations
- Security enhancements

This plan provides a structured approach to building a robust guarantor background information collector application with comprehensive testing coverage.
