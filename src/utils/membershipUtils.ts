import { MembershipType } from '../types/member';

export const membershipTypes: { value: MembershipType; label: string; description: string; price: string }[] = [
  {
    value: 'basic',
    label: 'Basic Membership',
    description: 'Access to gym equipment and basic facilities',
    price: '$29/month'
  },
  {
    value: 'premium',
    label: 'Premium Membership',
    description: 'Full gym access plus group classes and locker',
    price: '$49/month'
  },
  {
    value: 'vip',
    label: 'VIP Membership',
    description: 'All premium features plus personal training sessions',
    price: '$79/month'
  },
  {
    value: 'student',
    label: 'Student Membership',
    description: 'Discounted membership for students with valid ID',
    price: '$19/month'
  }
];

export const getMembershipTypeInfo = (type: MembershipType) => {
  return membershipTypes.find(mt => mt.value === type);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};