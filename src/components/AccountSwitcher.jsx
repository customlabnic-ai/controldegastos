import './AccountSwitcher.css';

export default function AccountSwitcher({ accounts, activeAccountId, onSelectAccount, totalBalance }) {
  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];

  return (
    <div className="account-switcher-container">
      <div className="account-card-mini flex-space-between" style={{ borderColor: activeAccount?.color }}>
        <div className="account-info">
          <p className="account-label">Cuenta Activa</p>
          <div className="flex-center" style={{gap: '8px'}}>
            <span className="material-symbols-outlined" style={{color: activeAccount?.color, fontSize: '20px'}}>
              {activeAccount?.type === 'cash' ? 'payments' : 'account_balance'}
            </span>
            <h3 className="account-name">{activeAccount?.name || 'Seleccionar cuenta'}</h3>
          </div>
        </div>
        <div className="account-balance-mini">
          <p className="balance-label">Disponible</p>
          <p className="balance-value">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="accounts-pill-list">
        {accounts.map(acc => (
          <button 
            key={acc.id} 
            className={`account-pill ${activeAccountId === acc.id ? 'active' : ''}`}
            onClick={() => onSelectAccount(acc.id)}
            style={activeAccountId === acc.id ? { backgroundColor: acc.color, color: 'white' } : {}}
          >
            {acc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
