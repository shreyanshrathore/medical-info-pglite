export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  email: string;
  phone: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  email: string;
  phone: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface QueryHistory {
  id: number;
  query: string;
  timestamp: string;
}