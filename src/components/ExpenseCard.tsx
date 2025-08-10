import React from 'react';
import { Expense, Person } from '../types';
import { Calendar, User, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
}

const categoryColors = {
  'Food & Dining': 'from-orange-500 to-red-500',
  'Transportation': 'from-blue-500 to-cyan-500',
  'Shopping': 'from-purple-500 to-pink-500',
  'Entertainment': 'from-green-500 to-teal-500',
  'Utilities': 'from-yellow-500 to-orange-500',
  'Travel': 'from-indigo-500 to-purple-500',
  'Healthcare': 'from-red-500 to-pink-500',
  'Other': 'from-gray-500 to-gray-600'
};

export function ExpenseCard({ expense, people }: ExpenseCardProps) {
  const paidByPerson = people.find(p => p.id === expense.paidBy);
  const categoryGradient = categoryColors[expense.category as keyof typeof categoryColors] || categoryColors.Other;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${categoryGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Tag className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {formatCurrency(expense.amount)}
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-gradient-to-r ${categoryGradient} text-white shadow-sm`}>
            {expense.category}
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-2">{expense.description}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {expense.date.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2 text-green-500" />
          <span>Paid by <span className="font-bold text-gray-900">{paidByPerson?.name}</span></span>
        </div>
        <div className="text-gray-600 font-medium">
          {expense.splits.length} people
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {expense.splits.map(split => {
            const person = people.find(p => p.id === split.personId);
            return (
              <div key={split.personId} className="flex items-center text-xs bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-3 py-1.5 border border-blue-200">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2 shadow-sm">
                  {person?.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{formatCurrency(split.amount)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}