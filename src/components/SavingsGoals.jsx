import { useState } from 'react';
import './SavingsGoals.css';

export default function SavingsGoals({ goals, transactions, onAddGoal, onUpdateGoal, onDeleteGoal }) {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', icon: 'star', color: '#007AFF' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    onAddGoal({
      name: newGoal.name,
      target_amount: parseFloat(newGoal.target),
      icon: newGoal.icon,
      color: newGoal.color
    });
    setNewGoal({ name: '', target: '', icon: 'star', color: '#007AFF' });
    setShowForm(false);
  };

  return (
    <div className="card savings-goals">
      <div className="flex-space-between" style={{marginBottom: '16px'}}>
        <h2 className="text-h2">Metas de Ahorro</h2>
        <button className="add-goal-btn" onClick={() => setShowForm(!showForm)}>
          <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
        </button>
      </div>

      {showForm && (
        <form className="goal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              className="text-input" 
              placeholder="Nombre de la meta (p.ej. Viaje)" 
              value={newGoal.name}
              onChange={e => setNewGoal({...newGoal, name: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="number" 
              className="text-input" 
              placeholder="Monto objetivo ($)" 
              value={newGoal.target}
              onChange={e => setNewGoal({...newGoal, target: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>Crear Meta</button>
        </form>
      )}

      <div className="goals-grid">
        {goals.map(goal => {
          const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          return (
            <div key={goal.id} className="goal-item-card">
              <div className="goal-header flex-space-between">
                <div className="flex-center" style={{gap: '8px'}}>
                  <span className="material-symbols-outlined" style={{color: goal.color}}>{goal.icon}</span>
                  <span className="goal-name">{goal.name}</span>
                </div>
                <button className="del-btn" onClick={() => onDeleteGoal(goal.id)}>
                   <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="goal-progress-info flex-space-between">
                <span className="current">${parseFloat(goal.current_amount).toFixed(0)}</span>
                <span className="target">${parseFloat(goal.target_amount).toFixed(0)}</span>
              </div>

              <div className="progress-bar-bg" style={{height: '8px'}}>
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${percent}%`, backgroundColor: goal.color }}
                ></div>
              </div>
              <p className="percent-text">{percent.toFixed(0)}% completado</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
