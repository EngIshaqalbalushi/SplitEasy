import React from 'react';
import { Person, Balance } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

interface BalanceCardProps {
  person: Person;
  balance: Balance;
}

export function BalanceCard({ person, balance }: BalanceCardProps) {
  const isPositive = balance.amount > 0;
  const isZero = Math.abs(balance.amount) < 0.01;
  
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border p-6 transition-all duration-300 transform hover:-translate-y-1 ${
      isZero ? 'border-white/20 hover:border-gray-300' : 
      isPositive ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-300' : 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50 hover:border-red-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-sm font-bold text-white mr-4 shadow-lg">
            {person.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{person.name}</h3>
            {person.email && (
              <p className="text-sm text-gray-500">{person.email}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`flex items-center text-xl font-bold mb-1 ${
            isZero ? 'text-gray-700' : 
            isPositive ? 'text-green-700' : 'text-red-700'
          }`}>
            {isZero ? (
              <CheckCircle className="w-6 h-6 mr-2" />
            ) : isPositive ? (
              <TrendingUp className="w-6 h-6 mr-2" />
            ) : (
              <TrendingDown className="w-6 h-6 mr-2" />
            )}
            {formatCurrency(Math.abs(balance.amount))}
          </div>
          <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
            isZero ? 'text-gray-600 bg-gray-100' : 
            isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}>
            {isZero ? 'All settled' : isPositive ? 'Gets back' : 'Owes'}
          </div>
        </div>
      </div>
    </div>
  );
}