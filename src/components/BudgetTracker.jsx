import { useState } from 'react';
import './BudgetTracker.css';

export default function BudgetTracker({ categories, transactions, budgets, onUpdateBudget }) {
  const [editingBudget, setEditingBudget] = useState(null);
  const [amount, setAmount] = useState('');

  // 1. Calcular gastos actuales por categoría para el mes actual
  const currentMonthExpenses = transactions.filter(tx => {
    if (tx.type !== 'expense') return false;
    const txDate = new Date(tx.created_at);
    const now = new Date();
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });

  const getExpenseAmount = (catId) => {
    return currentMonthExpenses
      .filter(tx => tx.category_id === catId)
      .reduce((acc, current) => acc + parseFloat(current.amount), 0);
  };

  const handleEdit = (cat) => {
    const existingBudget = budgets.find(b => b.category_id === cat.id);
    setEditingBudget(cat);
    setAmount(existingBudget ? existingBudget.amount_limit.toString() : '');
  };

  const handleSave = () => {
    if (isNaN(amount) || parseFloat(amount) < 0) return;
    onUpdateBudget(editingBudget.id, parseFloat(amount));
    setEditingBudget(null);
    setAmount('');
  };

  return (
    <div className="card budget-tracker">
      <h2 className="text-h2">Presupuestos Mensuales</h2>
      
      <div className="budgets-list">
        {categories.filter(c => c.type === 'expense' || c.type === 'both').map(cat => {
          const budget = budgets.find(b => b.category_id === cat.id);
          const limit = budget ? parseFloat(budget.amount_limit) : 0;
          const spent = getExpenseAmount(cat.id);
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isOver = spent > limit && limit > 0;

          return (
            <div key={cat.id} className="budget-item">
              <div className="budget-info flex-space-between">
                <div className="flex-center" style={{gap: '8px'}}>
                  <span className="material-symbols-outlined" style={{color: cat.color}}>{cat.icon}</span>
                  <span className="cat-name">{cat.name}</span>
                </div>
                <div className="budget-values">
                  <span className="spent">${spent.toFixed(0)}</span>
                  <span className="separator">/</span>
                  <button className="limit-btn" onClick={() => handleEdit(cat)}>
                    {limit > 0 ? `$${limit.toFixed(0)}` : 'Set limit'}
                  </button>
                </div>
              </div>
              
              <div className="progress-bar-bg">
                <div 
                  className={`progress-bar-fill ${isOver ? 'danger' : ''}`} 
                  style={{ width: `${percent}%`, backgroundColor: isOver ? '#FF3B30' : cat.color }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {editingBudget && (
        <div className="modal-overlay flex-center">
          <div className="card modal-content" style={{maxWidth: '300px', width: '90%'}}>
            <h3 className="text-h2">Presupuesto: {editingBudget.name}</h3>
            <p className="text-muted" style={{fontSize: '14px', marginBottom: '16px'}}>Define el límite mensual para esta categoría.</p>
            <div className="input-group">
              <input 
                type="number" 
                className="text-input" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex-space-between" style={{marginTop: '20px', gap: '10px'}}>
              <button className="btn-secondary" onClick={() => setEditingBudget(null)} style={{width: '100%'}}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave} style={{width: '100%', marginTop: 0}}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
