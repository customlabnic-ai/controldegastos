import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ExpenseChart.css';

export default function ExpenseChart({ transactions }) {
  // 1. Filtrar solo gastos
  const expenses = transactions.filter(t => t.type === 'expense');

  if (expenses.length === 0) return null;

  // 2. Agrupar por categoría
  const chartDataMap = expenses.reduce((acc, tx) => {
    const catName = tx.categories?.name || 'Otros';
    const catColor = tx.categories?.color || '#8E8E93';
    
    if (!acc[catName]) {
      acc[catName] = { name: catName, value: 0, color: catColor };
    }
    acc[catName].value += parseFloat(tx.amount);
    return acc;
  }, {});

  const data = Object.values(chartDataMap);

  return (
    <div className="card chart-container">
      <h2 className="text-h2">Distribución de Gastos</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-main)'
              }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
