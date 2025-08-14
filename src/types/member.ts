export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  membershipType: MembershipType;
  joinDate: Date;
  emergencyContact: EmergencyContact;
  status: 'active' | 'inactive' | 'suspended';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export type MembershipType = 'basic' | 'premium' | 'vip' | 'student';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}