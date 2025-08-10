import React, { useState } from 'react';
import { Group, Person, Expense, Settlement, Balance, DebtSummary } from '../types';
import { ArrowLeft, Plus, Receipt, Users, DollarSign } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { ExpenseCard } from './ExpenseCard';
import { AddExpenseModal } from './AddExpenseModal';
import { SettleUpModal } from './SettleUpModal';
import { calculateBalances, calculateDebts, formatCurrency } from '../utils/calculations';

interface GroupDetailProps {
  group: Group;
  expenses: Expense[];
  settlements: Settlement[];
  onBack: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'groupId' | 'createdAt'>) => void;
  onAddSettlement: (settlement: Omit<Settlement, 'id' | 'groupId'>) => void;
}

export function GroupDetail({ 
  group, 
  expenses, 
  settlements, 
  onBack, 
  onAddExpense,
  onAddSettlement 
}: GroupDetailProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'balances' | 'expenses'>('balances');

  const groupExpenses = expenses.filter(e => e.groupId === group.id);
  const groupSettlements = settlements.filter(s => s.groupId === group.id);
  const balances = calculateBalances(expenses, settlements, group.id);
  const debts = calculateDebts(balances);

  const totalExpenses = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'groupId' | 'createdAt'>) => {
    onAddExpense(expenseData);
    setShowAddExpense(false);
  };

  const handleSettle = (fromPersonId: string, toPersonId: string, amount: number) => {
    onAddSettlement({
      fromPersonId,
      toPersonId,
      amount,
      date: new Date()
    });
    setSelectedDebt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{group.name}</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1 text-blue-500" />
                  {group.members.length} members
                  <DollarSign className="w-4 h-4 ml-4 mr-1 text-green-500" />
                  {formatCurrency(totalExpenses)} total
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('balances')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'balances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Balances
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'expenses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Receipt className="w-4 h-4 inline mr-1" />
            Expenses ({groupExpenses.length})
          </button>
        </div>

        {activeTab === 'balances' && (
          <div className="space-y-8">
            {/* Balances */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Group Balances</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {balances.map(balance => {
                  const person = group.members.find(p => p.id === balance.personId);
                  if (!person) return null;
                  return (
                    <BalanceCard key={person.id} person={person} balance={balance} />
                  );
                })}
              </div>
            </div>

            {/* Settlements needed */}
            {debts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Settlements</h2>
                <div className="space-y-3">
                  {debts.map((debt, index) => {
                    const fromPerson = group.members.find(p => p.id === debt.fromPersonId);
                    const toPerson = group.members.find(p => p.id === debt.toPersonId);
                    if (!fromPerson || !toPerson) return null;

                    return (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-700 mr-3">
                              {fromPerson.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-900 font-medium">{fromPerson.name}</span>
                            <span className="text-gray-500 mx-2">owes</span>
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700 mr-3">
                              {toPerson.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-900 font-medium">{toPerson.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-4">
                              {formatCurrency(debt.amount)}
                            </span>
                            <button
                              onClick={() => setSelectedDebt(debt)}
                              className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Settle Up
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense History</h2>
            {groupExpenses.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-4">Add your first expense to get started!</p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupExpenses
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} people={group.members} />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddExpense && (
        <AddExpenseModal
          group={group}
          onClose={() => setShowAddExpense(false)}
          onAddExpense={handleAddExpense}
        />
      )}

      {selectedDebt && (
        <SettleUpModal
          debt={selectedDebt}
          people={group.members}
          onClose={() => setSelectedDebt(null)}
          onSettle={handleSettle}
        />
      )}
    </div>
  );
}