import './HistoryList.css';

export default function HistoryList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="history-empty text-muted">
        Aún no tienes registros. Empieza a añadir tus ingresos y gastos.
      </div>
    );
  }

  return (
    <div className="history-list">
      <h2 className="text-h2">Historial Reciente</h2>
      
      <div className="transactions-container">
        {transactions.map((tx) => {
          const category = tx.categories || {}; // Manejar casos donde no haya categoría
          
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
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="tx-actions">
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
