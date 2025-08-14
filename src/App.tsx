import React, { useState } from 'react';
import { useMembers } from './hooks/useMembers';
import { Dashboard } from './components/Dashboard';
import { MemberForm } from './components/MemberForm';
import { MemberList } from './components/MemberList';
import { Button } from './components/ui/Button';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Dumbbell,
  Menu,
  X
} from 'lucide-react';

type View = 'dashboard' | 'members' | 'add-member';

function App() {
  const { members, loading, addMember, updateMember, deleteMember, getExistingEmails } = useMembers();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'add-member', name: 'Add Member', icon: UserPlus },
  ];

  const handleAddMember = (member: any) => {
    addMember(member);
    setCurrentView('members');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard members={members} />;
      case 'members':
        return (
          <MemberList
            members={members}
            onUpdateMember={updateMember}
            onDeleteMember={deleteMember}
          />
        );
      case 'add-member':
        return (
          <MemberForm
            onSubmit={handleAddMember}
            existingEmails={getExistingEmails()}
            onCancel={() => setCurrentView('members')}
          />
        );
      default:
        return <Dashboard members={members} />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'members':
        return 'Members';
      case 'add-member':
        return 'Add New Member';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <Dumbbell className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-xl font-bold text-white">GymManager</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as View);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Stats in sidebar */}
        <div className="mt-8 px-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Members</span>
                <span className="text-white font-medium">{members.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active</span>
                <span className="text-green-400 font-medium">
                  {members.filter(m => m.status === 'active').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-white">{getPageTitle()}</h2>
            </div>
            
            {currentView !== 'add-member' && (
              <Button
                onClick={() => setCurrentView('add-member')}
                className="hidden sm:flex"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;