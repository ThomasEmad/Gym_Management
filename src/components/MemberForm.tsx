import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Member, FormErrors } from '../types/member';
import { validateMemberForm } from '../utils/validation';
import { membershipTypes, formatPhoneNumber } from '../utils/membershipUtils';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface MemberFormProps {
  onSubmit: (member: Member) => void;
  existingEmails: string[];
  onCancel?: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  onSubmit,
  existingEmails,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    membershipType: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (field: string, value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange(field, formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare member data
    const memberData: Partial<Member> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age, 10),
      membershipType: formData.membershipType as any,
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone
      }
    };

    // Validate form
    const validationErrors = validateMemberForm(memberData, existingEmails);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Create complete member object
    const newMember: Member = {
      id: uuidv4(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age, 10),
      membershipType: formData.membershipType as any,
      joinDate: new Date(),
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone
      },
      status: 'active'
    };

    try {
      onSubmit(newMember);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        membershipType: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Add New Member</h2>
        <p className="text-gray-400">Fill in the member information below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              success={formData.firstName && !errors.firstName}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              success={formData.lastName && !errors.lastName}
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              success={formData.email && !errors.email}
              placeholder="Enter email address"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange('phone', e.target.value)}
              error={errors.phone}
              success={formData.phone && !errors.phone}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Member Details */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Member Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              error={errors.age}
              success={formData.age && !errors.age}
              placeholder="Enter age"
              min="16"
              max="80"
            />
            <Select
              label="Membership Type"
              value={formData.membershipType}
              onChange={(e) => handleInputChange('membershipType', e.target.value)}
              error={errors.membershipType}
              success={formData.membershipType && !errors.membershipType}
              options={membershipTypes.map(type => ({
                value: type.value,
                label: `${type.label} - ${type.price}`
              }))}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
          <div className="space-y-4">
            <Input
              label="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              error={errors.emergencyContactName}
              success={formData.emergencyContactName && !errors.emergencyContactName}
              placeholder="Enter emergency contact name"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Relationship"
                value={formData.emergencyContactRelationship}
                onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                error={errors.emergencyContactRelationship}
                success={formData.emergencyContactRelationship && !errors.emergencyContactRelationship}
                placeholder="e.g., Parent, Spouse, Friend"
              />
              <Input
                label="Emergency Contact Phone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => handlePhoneChange('emergencyContactPhone', e.target.value)}
                error={errors.emergencyContactPhone}
                success={formData.emergencyContactPhone && !errors.emergencyContactPhone}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700">
          <Button
            type="submit"
            loading={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Add Member
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};