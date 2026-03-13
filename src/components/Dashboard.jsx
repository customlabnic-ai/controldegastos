import { formatCurrency } from '../utils/formatters';
import './Dashboard.css';

export default function Dashboard({ balance, ingresos, gastos }) {
  return (
    <div className="dashboard card">
      <div className="balance-section">
        <p className="text-muted">Balance Total</p>
        <h1 className="text-h1 balance-amount">{formatCurrency(balance)}</h1>
      </div>
      
      <div className="stats-row">
        <div className="stat-card income">
          <div className="stat-icon flex-center">
             <span className="material-symbols-outlined">arrow_downward</span>
          </div>
          <div>
            <p className="text-muted stat-label">Ingresos</p>
            <p className="stat-value">{formatCurrency(ingresos)}</p>
          </div>
        </div>
        
        <div className="stat-card expense">
          <div className="stat-icon flex-center">
             <span className="material-symbols-outlined">arrow_upward</span>
          </div>
          <div>
            <p className="text-muted stat-label">Gastos</p>
            <p className="stat-value">{formatCurrency(gastos)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
