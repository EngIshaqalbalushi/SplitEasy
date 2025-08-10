import React, { useState } from 'react';
import { Person, DebtSummary } from '../types';
import { X } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface SettleUpModalProps {
  debt: DebtSummary;
  people: Person[];
  onClose: () => void;
  onSettle: (fromPersonId: string, toPersonId: string, amount: number) => void;
}

export function SettleUpModal({ debt, people, onClose, onSettle }: SettleUpModalProps) {
  const [amount, setAmount] = useState(debt.amount.toString());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fromPerson = people.find(p => p.id === debt.fromPersonId);
  const toPerson = people.find(p => p.id === debt.toPersonId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settlementAmount = parseFloat(amount);
    if (!settlementAmount || settlementAmount <= 0) return;

    onSettle(debt.fromPersonId, debt.toPersonId, settlementAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Record Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-lg font-medium text-red-700 mx-auto mb-2">
                    {fromPerson?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{fromPerson?.name}</div>
                  <div className="text-xs text-gray-500">Paying</div>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg font-medium text-green-700 mx-auto mb-2">
                    {toPerson?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{toPerson?.name}</div>
                  <div className="text-xs text-gray-500">Receiving</div>
                </div>
              </div>
            </div>
          </div>

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
              max={debt.amount}
              required
            />
            <div className="text-sm text-gray-600 mt-1">
              Maximum: {formatCurrency(debt.amount)}
            </div>
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}