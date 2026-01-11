import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EXPENSE_CATEGORIES } from '@/lib/expense-categories';
import { Expense, CreateExpenseData, UpdateExpenseData } from '@/hooks/useExpenses';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateExpenseData | UpdateExpenseData) => void;
  expense?: Expense | null;
  isLoading?: boolean;
}

export function ExpenseForm({ open, onOpenChange, onSubmit, expense, isLoading }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState('');

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.expense_date);
      setNote(expense.note || '');
    } else {
      setAmount('');
      setCategory('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setNote('');
    }
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: CreateExpenseData = {
      amount: parseFloat(amount),
      category,
      expense_date: date,
      note: note || undefined,
    };

    if (expense) {
      onSubmit({ ...data, id: expense.id } as UpdateExpenseData);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !amount || !category}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {expense ? 'Update' : 'Add'} Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
