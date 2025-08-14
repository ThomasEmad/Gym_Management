import { useState, useEffect } from 'react';
import { Member } from '../types/member';

const STORAGE_KEY = 'gym_members';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedMembers = JSON.parse(stored).map((member: any) => ({
            ...member,
            joinDate: new Date(member.joinDate)
          }));
          setMembers(parsedMembers);
        }
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const saveMembers = (updatedMembers: Member[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMembers));
      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error saving members:', error);
    }
  };

  const addMember = (member: Member) => {
    const updatedMembers = [...members, member];
    saveMembers(updatedMembers);
  };

  const updateMember = (id: string, updatedMember: Partial<Member>) => {
    const updatedMembers = members.map(member =>
      member.id === id ? { ...member, ...updatedMember } : member
    );
    saveMembers(updatedMembers);
  };

  const deleteMember = (id: string) => {
    const updatedMembers = members.filter(member => member.id !== id);
    saveMembers(updatedMembers);
  };

  const getExistingEmails = () => {
    return members.map(member => member.email.toLowerCase());
  };

  return {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
    getExistingEmails
  };
};