import { Member, ValidationError, FormErrors } from '../types/member';

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (name.trim().length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
};

export const validateEmail = (email: string, existingEmails: string[] = []): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  if (existingEmails.includes(email.trim().toLowerCase())) {
    return 'This email is already registered';
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  
  if (cleanPhone.length > 15) {
    return 'Phone number must be less than 15 digits';
  }
  
  return null;
};

export const validateAge = (age: string): string | null => {
  if (!age.trim()) {
    return 'Age is required';
  }
  
  const numAge = parseInt(age, 10);
  
  if (isNaN(numAge)) {
    return 'Age must be a valid number';
  }
  
  if (numAge < 16) {
    return 'Member must be at least 16 years old';
  }
  
  if (numAge > 80) {
    return 'Please contact us directly for members over 80';
  }
  
  return null;
};

export const validateMembershipType = (type: string): string | null => {
  const validTypes = ['basic', 'premium', 'vip', 'student'];
  
  if (!type) {
    return 'Membership type is required';
  }
  
  if (!validTypes.includes(type)) {
    return 'Please select a valid membership type';
  }
  
  return null;
};

export const validateEmergencyContact = (contact: { name: string; relationship: string; phone: string }): FormErrors => {
  const errors: FormErrors = {};
  
  const nameError = validateName(contact.name, 'Emergency contact name');
  if (nameError) errors.emergencyContactName = nameError;
  
  if (!contact.relationship.trim()) {
    errors.emergencyContactRelationship = 'Relationship is required';
  }
  
  const phoneError = validatePhone(contact.phone);
  if (phoneError) errors.emergencyContactPhone = phoneError;
  
  return errors;
};

export const validateMemberForm = (
  formData: Partial<Member>,
  existingEmails: string[] = []
): FormErrors => {
  const errors: FormErrors = {};
  
  // Validate first name
  const firstNameError = validateName(formData.firstName || '', 'First name');
  if (firstNameError) errors.firstName = firstNameError;
  
  // Validate last name
  const lastNameError = validateName(formData.lastName || '', 'Last name');
  if (lastNameError) errors.lastName = lastNameError;
  
  // Validate email
  const emailError = validateEmail(formData.email || '', existingEmails);
  if (emailError) errors.email = emailError;
  
  // Validate phone
  const phoneError = validatePhone(formData.phone || '');
  if (phoneError) errors.phone = phoneError;
  
  // Validate age
  const ageError = validateAge(formData.age?.toString() || '');
  if (ageError) errors.age = ageError;
  
  // Validate membership type
  const membershipError = validateMembershipType(formData.membershipType || '');
  if (membershipError) errors.membershipType = membershipError;
  
  // Validate emergency contact
  if (formData.emergencyContact) {
    const emergencyErrors = validateEmergencyContact(formData.emergencyContact);
    Object.assign(errors, emergencyErrors);
  } else {
    errors.emergencyContactName = 'Emergency contact information is required';
    errors.emergencyContactRelationship = 'Emergency contact relationship is required';
    errors.emergencyContactPhone = 'Emergency contact phone is required';
  }
  
  return errors;
};