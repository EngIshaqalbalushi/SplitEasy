import React, { useState } from 'react';
import { X, Plus, Minus, Users } from 'lucide-react';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreateGroup: (name: string, members: { name: string; email: string }[]) => void;
}

export function CreateGroupModal({ onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([
    { name: '', email: '' },
    { name: '', email: '' }
  ]);

  const addMember = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 2) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: 'name' | 'email', value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) return;
    
    const validMembers = members.filter(m => m.name.trim());
    if (validMembers.length < 2) return;

    onCreateGroup(groupName.trim(), validMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Create Group</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
              placeholder="Weekend Trip, Roommates, etc."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-700">
                Members
              </label>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add member
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => updateMember(index, 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Email (optional)"
                    />
                  </div>
                  {members.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}