import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/hooks/useExpenses';
import { getCategoryConfig, EXPENSE_CATEGORIES } from '@/lib/expense-categories';

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = [
  'hsl(25, 95%, 53%)',    // food
  'hsl(199, 89%, 48%)',   // transport
  'hsl(280, 87%, 65%)',   // entertainment
  'hsl(339, 90%, 51%)',   // shopping
  'hsl(142, 71%, 45%)',   // bills
  'hsl(0, 84%, 60%)',     // health
  'hsl(215, 16%, 47%)',   // other
];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const category = expense.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
    });

    return Object.entries(categoryTotals).map(([category, total]) => {
      const config = getCategoryConfig(category);
      return {
        name: config.label,
        value: total,
        category,
      };
    });
  }, [expenses]);

  if (chartData.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">No expenses to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => {
                const categoryIndex = EXPENSE_CATEGORIES.findIndex(c => c.value === entry.category);
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[categoryIndex !== -1 ? categoryIndex : 6]} 
                    stroke="none"
                  />
                );
              })}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
