import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Button } from '@/components/ui/button';
import { useExpenses, Expense, CreateExpenseData, UpdateExpenseData } from '@/hooks/useExpenses';
import { DollarSign, TrendingUp, Calendar, Plus, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { expenses, isLoading, createExpense, updateExpense, deleteExpense } = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.expense_date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    const totalThisMonth = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalAll = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const transactionsThisMonth = monthlyExpenses.length;
    const avgPerTransaction = transactionsThisMonth > 0 ? totalThisMonth / transactionsThisMonth : 0;

    return {
      totalThisMonth,
      totalAll,
      transactionsThisMonth,
      avgPerTransaction,
      currentMonth: format(now, 'MMMM yyyy'),
    };
  }, [expenses]);

  const handleOpenForm = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (data: CreateExpenseData | UpdateExpenseData) => {
    if ('id' in data) {
      await updateExpense.mutateAsync(data);
    } else {
      await createExpense.mutateAsync(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteExpense.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">{stats.currentMonth}</p>
          </div>
          <Button onClick={() => handleOpenForm()} className="gradient-primary border-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="This Month"
            value={`$${stats.totalThisMonth.toFixed(2)}`}
            subtitle={`${stats.transactionsThisMonth} transactions`}
            icon={<DollarSign className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="All Time"
            value={`$${stats.totalAll.toFixed(2)}`}
            subtitle={`${expenses.length} total transactions`}
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="Avg per Transaction"
            value={`$${stats.avgPerTransaction.toFixed(2)}`}
            subtitle="This month"
            icon={<Calendar className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="Transactions"
            value={stats.transactionsThisMonth.toString()}
            subtitle="This month"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Chart and List */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ExpenseChart expenses={expenses.filter(e => {
            const expenseDate = new Date(e.expense_date);
            return isWithinInterval(expenseDate, { 
              start: startOfMonth(new Date()), 
              end: endOfMonth(new Date()) 
            });
          })} />
          <ExpenseList
            expenses={expenses.slice(0, 10)}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            isDeleting={deleteExpense.isPending}
          />
        </div>
      </main>

      <ExpenseForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        expense={editingExpense}
        isLoading={createExpense.isPending || updateExpense.isPending}
      />
    </div>
  );
}
