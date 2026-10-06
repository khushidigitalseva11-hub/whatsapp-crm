// ==================================================================================
// SHREE RADHE KRISHNA DIGITAL SERVICE – Data Models & Types
// Integrated into JARVIS Operating System
// ==================================================================================

export type ApplicationStatus =
  | 'Application Received'
  | 'Payment Pending'
  | 'Payment Received'
  | 'Document Checking'
  | 'Processing'
  | 'Correction Required'
  | 'Completed'
  | 'Rejected / Cancelled';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Application Received',
  'Payment Pending',
  'Payment Received',
  'Document Checking',
  'Processing',
  'Correction Required',
  'Completed',
  'Rejected / Cancelled',
];

export const STATUS_LABELS: Record<
  ApplicationStatus,
  { en: string; gu: string; color: string; bg: string; border: string }
> = {
  'Application Received': {
    en: 'Application Received',
    gu: 'અરજી મળી ગઈ છે',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  'Payment Pending': {
    en: 'Payment Pending',
    gu: 'ચુકવણી બાકી છે',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  'Payment Received': {
    en: 'Payment Received',
    gu: 'ચુકવણી સ્વીકારાઈ',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  'Document Checking': {
    en: 'Document Checking',
    gu: 'દસ્તાવેજ ચકાસણી ચાલુ છે',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  'Processing': {
    en: 'Processing',
    gu: 'સરકારી પોર્ટલ પર પ્રોસેસિંગ',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  'Correction Required': {
    en: 'Correction Required',
    gu: 'સુધારો / ફરીથી અપલોડ જરૂરી',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  'Completed': {
    en: 'Completed',
    gu: 'સફળતાપૂર્વક પૂર્ણ થયેલ',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
  },
  'Rejected / Cancelled': {
    en: 'Rejected / Cancelled',
    gu: 'અરજી રદ / અસ્વીકાર',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
};

export type DocumentStatus =
  | 'Pending'
  | 'Uploaded'
  | 'Verified'
  | 'Rejected'
  | 'Re-upload Required'
  | 'Final Document';

export interface RequiredDocumentDef {
  id: string;
  doc_code: string;
  doc_name: string;
  doc_name_gu: string;
  is_mandatory: boolean;
}

export interface ServiceFormField {
  id: string;
  field_name: string;
  label: string;
  label_gu: string;
  field_type: 'text' | 'number' | 'date' | 'dropdown' | 'textarea' | 'checkbox';
  options?: string[];
  is_required: boolean;
  display_order: number;
}

export interface DigitalService {
  id: string;
  service_code: string;
  name: string;
  name_gu: string;
  price: number;
  category: string;
  description: string;
  instructions?: string;
  active: boolean;
  display_order: number;
  required_documents?: RequiredDocumentDef[];
  form_fields?: ServiceFormField[];
}

export interface CustomerProfile {
  id: string;
  user_id?: string;
  full_name: string;
  mobile: string;
  email?: string;
  address?: string;
  district?: string;
  taluka?: string;
  village_city?: string;
  pincode?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  customer_id: string;
  doc_type: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  status: DocumentStatus;
  rejection_reason?: string;
  uploaded_at: string;
  verified_at?: string;
}

export interface ApplicationStatusHistoryItem {
  id: string;
  application_id: string;
  from_status: ApplicationStatus | null;
  to_status: ApplicationStatus;
  notes?: string;
  changed_by?: string;
  created_at: string;
}

export interface DigitalApplication {
  id: string;
  application_number: string;
  customer_id: string;
  service_id: string;
  service_name: string;
  service_name_gu: string;
  locked_price: number;
  current_status: ApplicationStatus;
  payment_status: 'Unpaid' | 'Paid' | 'Refunded';
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
  form_data: Record<string, unknown>;
  documents: ApplicationDocument[];
  status_history: ApplicationStatusHistoryItem[];
  final_document_url?: string;
  final_document_name?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
