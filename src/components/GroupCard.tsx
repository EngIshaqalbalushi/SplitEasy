import React from 'react';
import { Group, Person } from '../types';
import { Users, Calendar, ArrowRight } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
  memberBalances: { [personId: string]: number };
}

const groupImages = [
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400'
];

export function GroupCard({ group, onClick, memberBalances }: GroupCardProps) {
  const totalBalance = Object.values(memberBalances).reduce((sum, balance) => sum + Math.abs(balance), 0);
  const hasActivity = totalBalance > 0;
  const imageIndex = Math.abs(group.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % groupImages.length;

  return (
    <div 
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 hover:border-blue-300 overflow-hidden group transform hover:-translate-y-1"
    >
      <div className="relative h-32 mb-4 -mx-6 -mt-6">
        <img 
          src={groupImages[imageIndex]} 
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-6 right-6">
          <h3 className="text-lg font-bold text-white truncate">{group.name}</h3>
        </div>
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            hasActivity 
              ? 'bg-orange-500/90 text-white' 
              : 'bg-green-500/90 text-white'
          }`}>
            {hasActivity ? 'Active' : 'Settled'}
          </div>
        </div>
      </div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <Users className="w-4 h-4 mr-1 text-blue-500" />
          <span className="font-medium">{group.members.length} members</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowRight className="w-5 h-5 text-blue-500" />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-1 text-purple-500" />
          {group.createdAt.toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {group.members.slice(0, 4).map(member => (
          <div key={member.id} className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
              {member.name.charAt(0).toUpperCase()}
            </div>
          </div>
        ))}
        {group.members.length > 4 && (
          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
            +{group.members.length - 4}
          </div>
        )}
      </div>
    </div>
  );
}