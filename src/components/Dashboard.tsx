import React from 'react';
import { Member } from '../types/member';
import { Card } from './ui/Card';
import { Users, UserCheck, UserX, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  members: Member[];
}

export const Dashboard: React.FC<DashboardProps> = ({ members }) => {
  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length,
    suspended: members.filter(m => m.status === 'suspended').length,
  };

  const membershipBreakdown = {
    basic: members.filter(m => m.membershipType === 'basic').length,
    premium: members.filter(m => m.membershipType === 'premium').length,
    vip: members.filter(m => m.membershipType === 'vip').length,
    student: members.filter(m => m.membershipType === 'student').length,
  };

  const recentMembers = members
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue' 
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color?: string;
  }) => (
    <Card className="hover:border-gray-600 transition-colors duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-500/10 mr-4`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Members"
          value={stats.active}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Inactive Members"
          value={stats.inactive}
          icon={UserX}
          color="gray"
        />
        <StatCard
          title="Suspended Members"
          value={stats.suspended}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Breakdown */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Membership Types</h3>
            <p className="text-sm text-gray-400">Distribution of membership plans</p>
          </div>
          <div className="space-y-3">
            {Object.entries(membershipBreakdown).map(([type, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-sm text-gray-300 capitalize">{type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-white mr-2">{count}</span>
                    <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Members */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Recent Members</h3>
            <p className="text-sm text-gray-400">Latest member registrations</p>
          </div>
          {recentMembers.length > 0 ? (
            <div className="space-y-3">
              {recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      member.status === 'active' 
                        ? 'text-green-400 bg-green-400/10' 
                        : 'text-gray-400 bg-gray-400/10'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-8 w-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-400">No members registered yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};