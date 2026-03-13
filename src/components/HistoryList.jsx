import { formatCurrency, formatDate } from '../utils/formatters';
import './HistoryList.css';

export default function HistoryList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="history-empty text-muted card">
        Aún no tienes registros. Empieza a añadir tus ingresos y gastos.
      </div>
    );
  }

  return (
    <div className="history-list">
      <h2 className="text-h2">Historial Reciente</h2>
      
      <div className="transactions-container">
        {transactions.map((tx) => {
          const category = tx.categories || {}; 
          
          return (
            <div key={tx.id} className="transaction-item card">
              <div className="tx-details">
                <div 
                  className={`tx-icon ${tx.type}`} 
                  style={category.color ? { backgroundColor: `${category.color}20`, color: category.color } : {}}
                >
                  <span className="material-symbols-outlined">
                    {category.icon || (tx.type === 'income' ? 'arrow_downward' : 'arrow_upward')}
                  </span>
                </div>
                <div className="tx-info">
                  <p className="tx-description">{tx.description}</p>
                  <p className="tx-date">
                    {category.name && <span className="cat-label">{category.name} • </span>}
                    {formatDate(tx.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="tx-actions">
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <button className="delete-btn" onClick={() => onDelete(tx.id)} title="Eliminar registro">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
