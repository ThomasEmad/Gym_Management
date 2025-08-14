import React, { useState } from 'react';
import { format } from 'date-fns';
import { Member } from '../types/member';
import { getMembershipTypeInfo } from '../utils/membershipUtils';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Users, Search, Filter, Mail, Phone, Calendar, UserCheck } from 'lucide-react';

interface MemberListProps {
  members: Member[];
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onUpdateMember,
  onDeleteMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('');

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || member.status === statusFilter;
    const matchesMembership = !membershipFilter || member.membershipType === membershipFilter;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });

  const handleStatusChange = (memberId: string, newStatus: Member['status']) => {
    onUpdateMember(memberId, { status: newStatus });
  };

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/10';
      case 'suspended':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (members.length === 0) {
    return (
      <Card className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No members yet</h3>
        <p className="text-gray-400">Add your first member to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' }
              ]}
            />
            <Select
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value)}
              options={[
                { value: '', label: 'All Memberships' },
                { value: 'basic', label: 'Basic' },
                { value: 'premium', label: 'Premium' },
                { value: 'vip', label: 'VIP' },
                { value: 'student', label: 'Student' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const membershipInfo = getMembershipTypeInfo(member.membershipType);
          
          return (
            <Card key={member.id} className="hover:border-gray-600 transition-colors duration-200">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Member since {format(member.joinDate, 'MMM yyyy')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {member.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                    Age: {member.age}
                  </div>
                </div>

                {/* Membership Info */}
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      {membershipInfo?.label}
                    </span>
                    <span className="text-sm text-blue-400 font-medium">
                      {membershipInfo?.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {membershipInfo?.description}
                  </p>
                </div>

                {/* Emergency Contact */}
                <div className="text-sm">
                  <p className="text-gray-400 mb-1">Emergency Contact:</p>
                  <p className="text-white">
                    {member.emergencyContact.name} ({member.emergencyContact.relationship})
                  </p>
                  <p className="text-gray-300">{member.emergencyContact.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-700">
                  <Select
                    value={member.status}
                    onChange={(e) => handleStatusChange(member.id, e.target.value as Member['status'])}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'suspended', label: 'Suspended' }
                    ]}
                    className="flex-1"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
                        onDeleteMember(member.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredMembers.length === 0 && members.length > 0 && (
        <Card className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No members found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  );
};