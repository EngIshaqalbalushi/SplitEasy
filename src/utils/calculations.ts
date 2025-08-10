import { Expense, Settlement, Balance, DebtSummary, Person } from '../types';

export function calculateBalances(
  expenses: Expense[], 
  settlements: Settlement[], 
  groupId: string
): Balance[] {
  const balances: { [personId: string]: number } = {};

  // Initialize balances for all people involved
  const allPersonIds = new Set<string>();
  expenses.filter(e => e.groupId === groupId).forEach(expense => {
    allPersonIds.add(expense.paidBy);
    expense.splits.forEach(split => allPersonIds.add(split.personId));
  });
  settlements.filter(s => s.groupId === groupId).forEach(settlement => {
    allPersonIds.add(settlement.fromPersonId);
    allPersonIds.add(settlement.toPersonId);
  });

  allPersonIds.forEach(personId => {
    balances[personId] = 0;
  });

  // Calculate from expenses
  expenses.filter(e => e.groupId === groupId).forEach(expense => {
    // Person who paid gets positive balance
    balances[expense.paidBy] += expense.amount;
    
    // People who owe get negative balance
    expense.splits.forEach(split => {
      balances[split.personId] -= split.amount;
    });
  });

  // Apply settlements
  settlements.filter(s => s.groupId === groupId).forEach(settlement => {
    balances[settlement.fromPersonId] -= settlement.amount;
    balances[settlement.toPersonId] += settlement.amount;
  });

  return Object.entries(balances).map(([personId, amount]) => ({
    personId,
    amount: Math.round(amount * 100) / 100 // Round to 2 decimal places
  }));
}

export function calculateDebts(balances: Balance[]): DebtSummary[] {
  const debts: DebtSummary[] = [];
  const positiveBalances = balances.filter(b => b.amount > 0);
  const negativeBalances = balances.filter(b => b.amount < 0);

  // Simple debt resolution algorithm
  for (const creditor of positiveBalances) {
    for (const debtor of negativeBalances) {
      if (creditor.amount > 0 && debtor.amount < 0) {
        const settlementAmount = Math.min(creditor.amount, -debtor.amount);
        if (settlementAmount > 0.01) { // Only include debts over 1 cent
          debts.push({
            fromPersonId: debtor.personId,
            toPersonId: creditor.personId,
            amount: Math.round(settlementAmount * 100) / 100
          });
          creditor.amount -= settlementAmount;
          debtor.amount += settlementAmount;
        }
      }
    }
  }

  return debts;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}