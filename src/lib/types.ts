export type RecordCategory = 
  | 'lab-report' 
  | 'prescription' 
  | 'radiology' 
  | 'discharge' 
  | 'vaccination' 
  | 'other';

export interface Biomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'elevated' | 'low';
  clinicalNote?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: RecordCategory;
  doctorName: string;
  facility: string;
  date: string;
  fileSize: string;
  fileType: string;
  fileUrl?: string;
  summary: string;
  keyFindings: string[];
  tags: string[];
  isEncrypted: boolean;
  status: 'verified' | 'pending-review' | 'archived';
  biomarkers?: Biomarker[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  instructions: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  remainingRefills: number;
  isTakenToday: boolean;
  takenHistory: { date: string; taken: boolean }[];
}

export interface MedicineProduct {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: 'Cardiovascular' | 'Diabetes Care' | 'Pain Relief' | 'Respiratory' | 'Vitamins & Supplements' | 'First Aid';
  price: number;
  inStock: boolean;
  requiresRx: boolean;
  dosageForm: string;
  strength: string;
  packageSize: string;
  description: string;
  imageUrl?: string;
}

export interface CartItem {
  product: MedicineProduct;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    locality?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone: string;
  };
  paymentMethod: string;
  status: 'Processing' | 'Pharmacist Review' | 'Dispatched' | 'Delivered';
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface ShareLink {
  id: string;
  recipientName: string;
  recipientRole: 'Doctor' | 'Specialist' | 'Caregiver' | 'Insurance' | 'Family';
  organization: string;
  createdAt: string;
  expiresAt: string;
  accessLevel: 'Full Vault' | 'Lab Reports Only' | 'Single Document';
  targetRecordTitle?: string;
  pinRequired: boolean;
  pinCode?: string;
  viewCount: number;
  isActive: boolean;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryPhysician: {
    name: string;
    hospital: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  relatedRecordId?: string;
}
