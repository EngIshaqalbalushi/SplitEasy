import React, { useState } from 'react';
import { Group, Person, Expense, Settlement } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GroupCard } from './components/GroupCard';
import { GroupDetail } from './components/GroupDetail';
import { CreateGroupModal } from './components/CreateGroupModal';
import { calculateBalances } from './utils/calculations';
import { Plus, Users, Receipt, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

function App() {
  const [groups, setGroups] = useLocalStorage<Group[]>('splitwise-groups', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('splitwise-expenses', []);
  const [settlements, setSettlements] = useLocalStorage<Settlement[]>('splitwise-settlements', []);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const handleCreateGroup = (name: string, memberData: { name: string; email: string }[]) => {
    const members: Person[] = memberData.map(data => ({
      id: generateId(),
      name: data.name,
      email: data.email || undefined
    }));

    const newGroup: Group = {
      id: generateId(),
      name,
      members,
      createdAt: new Date()
    };

    setGroups(prev => [...prev, newGroup]);
    setShowCreateGroup(false);
  };

  const handleAddExpense = (groupId: string, expenseData: Omit<Expense, 'id' | 'groupId' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      groupId,
      createdAt: new Date()
    };

    setExpenses(prev => [...prev, newExpense]);
  };

  const handleAddSettlement = (groupId: string, settlementData: Omit<Settlement, 'id' | 'groupId'>) => {
    const newSettlement: Settlement = {
      ...settlementData,
      id: generateId(),
      groupId
    };

    setSettlements(prev => [...prev, newSettlement]);
  };

  const getGroupBalances = (groupId: string) => {
    const balances = calculateBalances(expenses, settlements, groupId);
    const memberBalances: { [personId: string]: number } = {};
    balances.forEach(balance => {
      memberBalances[balance.personId] = balance.amount;
    });
    return memberBalances;
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const activeGroups = groups.filter(group => {
    const memberBalances = getGroupBalances(group.id);
    return Object.values(memberBalances).some(balance => Math.abs(balance) > 0.01);
  }).length;

  if (selectedGroup) {
    return (
      <GroupDetail
        group={selectedGroup}
        expenses={expenses}
        settlements={settlements}
        onBack={() => setSelectedGroup(null)}
        onAddExpense={(expenseData) => handleAddExpense(selectedGroup.id, expenseData)}
        onAddSettlement={(settlementData) => handleAddSettlement(selectedGroup.id, settlementData)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SplitEasy</h1>
              </div>
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Group
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {groups.length === 0 && (
          <div className="text-center mb-12">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Friends sharing expenses" 
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4">Split expenses with ease</h2>
                  <p className="text-xl opacity-90">Track shared costs, settle debts, and keep friendships strong</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{groups.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Groups</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{expenses.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Expenses</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${totalExpenses.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-gray-600">Total Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
            {activeGroups > 0 && (
              <div className="text-sm font-medium text-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full border border-orange-200 shadow-sm">
                {activeGroups} group{activeGroups !== 1 ? 's' : ''} with active balances
              </div>
            )}
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Group of friends" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-2xl border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to start splitting?</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Create your first group to start tracking shared expenses with friends, roommates, or travel companions.
              </p>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Plus className="w-6 h-6 mr-3" />
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groups
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map(group => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => setSelectedGroup(group)}
                    memberBalances={getGroupBalances(group.id)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
}

export default App;