import React, { useState } from 'react';
import { Group, Person, ExpenseSplit } from '../types';
import { X } from 'lucide-react';

interface AddExpenseModalProps {
  group: Group;
  onClose: () => void;
  onAddExpense: (expense: {
    description: string;
    amount: number;
    paidBy: string;
    splits: ExpenseSplit[];
    category: string;
    date: Date;
  }) => void;
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Travel',
  'Healthcare',
  'Other'
];

export function AddExpenseModal({ group, onClose, onAddExpense }: AddExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(group.members[0]?.id || '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [personId: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseAmount = parseFloat(amount);
    if (!description || !expenseAmount || expenseAmount <= 0) return;

    let splits: ExpenseSplit[];
    
    if (splitType === 'equal') {
      const splitAmount = expenseAmount / group.members.length;
      splits = group.members.map(member => ({
        personId: member.id,
        amount: Math.round(splitAmount * 100) / 100
      }));
    } else {
      splits = group.members.map(member => ({
        personId: member.id,
        amount: parseFloat(customSplits[member.id] || '0')
      }));
    }

    onAddExpense({
      description,
      amount: expenseAmount,
      paidBy,
      splits,
      category,
      date: new Date(date)
    });

    onClose();
  };

  const updateCustomSplit = (personId: string, value: string) => {
    setCustomSplits(prev => ({ ...prev, [personId]: value }));
  };

  const totalCustomSplits = group.members.reduce((sum, member) => {
    return sum + (parseFloat(customSplits[member.id] || '0') || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What was this expense for?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid by
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {group.members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split
            </label>
            <div className="flex space-x-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="equal"
                  checked={splitType === 'equal'}
                  onChange={(e) => setSplitType(e.target.value as 'equal')}
                  className="mr-2"
                />
                Split equally
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="custom"
                  checked={splitType === 'custom'}
                  onChange={(e) => setSplitType(e.target.value as 'custom')}
                  className="mr-2"
                />
                Custom amounts
              </label>
            </div>

            {splitType === 'custom' && (
              <div className="space-y-2">
                {group.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{member.name}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={customSplits[member.id] || ''}
                      onChange={(e) => updateCustomSplit(member.id, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                ))}
                {amount && totalCustomSplits !== parseFloat(amount) && (
                  <div className="text-sm text-red-600 mt-2">
                    Total splits (${totalCustomSplits.toFixed(2)}) must equal expense amount (${parseFloat(amount).toFixed(2)})
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={splitType === 'custom' && amount && totalCustomSplits !== parseFloat(amount)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}