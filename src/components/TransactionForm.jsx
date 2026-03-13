import { useState, useEffect } from 'react';
import './TransactionForm.css';

export default function TransactionForm({ onAddTransaction, categories }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Filtrar categorías por tipo (ingreso/gasto)
  const filteredCategories = categories.filter(c => 
    c.type === type || c.type === 'both'
  );

  // Auto-seleccionar la primera categoría al cambiar de tipo
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    if (!description.trim()) return;

    onAddTransaction({
      amount: parseFloat(amount),
      type,
      description: description.trim(),
      category_id: categoryId
    });

    setAmount('');
    setDescription('');
  };

  return (
    <form className="card transaction-form" onSubmit={handleSubmit}>
      <h2 className="text-h2">Nuevo Registro</h2>
      
      <div className="type-selector flex-space-between">
        <button 
          type="button"
          className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
          onClick={() => setType('expense')}
        >
          Gasto
        </button>
        <button 
          type="button"
          className={`type-btn income ${type === 'income' ? 'active' : ''}`}
          onClick={() => setType('income')}
        >
          Ingreso
        </button>
      </div>

      <div className="input-group">
        <div className="amount-input-wrapper flex-center">
          <span className="currency-symbol">$</span>
          <input 
            type="number" 
            className="amount-input" 
            placeholder="0.00" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="input-group">
        <p className="text-muted" style={{marginBottom: '8px', fontSize: '13px'}}>Categoría</p>
        <div className="categories-grid">
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${categoryId === cat.id ? 'active' : ''}`}
              onClick={() => setCategoryId(cat.id)}
              style={{ '--cat-color': cat.color }}
            >
              <span className="material-symbols-outlined">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <input 
          type="text" 
          className="text-input" 
          placeholder="Descripción (ej. Supermercado)" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
        <span className="material-symbols-outlined">add_circle</span>
        Añadir Registro
      </button>
    </form>
  );
}
