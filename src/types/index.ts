export interface Person {
  id: string;
  name: string;
  email?: string;
}

export interface Group {
  id: string;
  name: string;
  members: Person[];
  createdAt: Date;
}

export interface ExpenseSplit {
  personId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splits: ExpenseSplit[];
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromPersonId: string;
  toPersonId: string;
  amount: number;
  date: Date;
}

export interface Balance {
  personId: string;
  amount: number;
}

export interface DebtSummary {
  fromPersonId: string;
  toPersonId: string;
  amount: number;
}