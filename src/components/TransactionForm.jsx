import { useState } from 'react';
import './TransactionForm.css';

export default function TransactionForm({ onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    if (!description.trim()) return;

    onAddTransaction({
      amount: parseFloat(amount),
      type,
      description: description.trim()
    });

    // Resetear form
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
