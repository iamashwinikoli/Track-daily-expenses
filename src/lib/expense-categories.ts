import { UtensilsCrossed, Car, Gamepad2, ShoppingBag, FileText, Heart, MoreHorizontal } from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: UtensilsCrossed, color: 'expense-food' },
  { value: 'transport', label: 'Transport', icon: Car, color: 'expense-transport' },
  { value: 'entertainment', label: 'Entertainment', icon: Gamepad2, color: 'expense-entertainment' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'expense-shopping' },
  { value: 'bills', label: 'Bills & Utilities', icon: FileText, color: 'expense-bills' },
  { value: 'health', label: 'Health', icon: Heart, color: 'expense-health' },
  { value: 'other', label: 'Other', icon: MoreHorizontal, color: 'expense-other' },
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['value'];

export function getCategoryConfig(category: string) {
  return EXPENSE_CATEGORIES.find(c => c.value === category) || EXPENSE_CATEGORIES[6];
}
