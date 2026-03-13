import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import HistoryList from './components/HistoryList';
import ExpenseChart from './components/ExpenseChart';
import BudgetTracker from './components/BudgetTracker';
import SavingsGoals from './components/SavingsGoals';
import AccountSwitcher from './components/AccountSwitcher';
import Auth from './components/Auth';
import { useFinance } from './hooks/useFinance';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    transactions,
    allCategories,
    budgets,
    goals,
    accounts,
    activeAccountId,
    totals,
    loading: financeLoading,
    error,
    setActiveAccountId,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addGoal,
    deleteGoal
  } = useFinance(user?.id);

  // Pantalla de carga inicial (Auth)
  if (authLoading) {
    return (
      <div className="app-container flex-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Si no hay usuario, mostrar Login/Registro
  if (!user) {
    return <Auth />;
  }

  // Si hay usuario pero los datos financieros están cargando
  if (financeLoading) {
    return (
      <div className="app-container flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '12px' }}>
        <div className="spinner"></div>
        <p className="text-muted">Cargando tus datos privados...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header con Logout */}
      <div className="flex-space-between" style={{ padding: '20px 20px 0' }}>
        <p className="text-muted" style={{ fontWeight: '600' }}>Hola, {user.email.split('@')[0]}</p>
        <button 
          onClick={signOut} 
          className="text-muted flex-center" 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', gap: '4px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
          Salir
        </button>
      </div>

      {error && (
        <div className="error-banner" style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '10px', textAlign: 'center', fontSize: '14px', margin: '10px' }}>
          {error}
        </div>
      )}

      <Dashboard 
        balance={totals.balance} 
        ingresos={totals.income} 
        gastos={totals.expense} 
      />
      
      <AccountSwitcher 
        accounts={accounts} 
        activeAccountId={activeAccountId} 
        onSelectAccount={setActiveAccountId}
        totalBalance={totals.balance}
      />

      <ExpenseChart transactions={transactions} />
      
      <BudgetTracker 
        categories={allCategories} 
        transactions={transactions} 
        budgets={budgets} 
        onUpdateBudget={updateBudget} 
      />
      
      <SavingsGoals 
        goals={goals} 
        transactions={transactions} 
        onAddGoal={addGoal} 
        onDeleteGoal={deleteGoal} 
      />
      
      <TransactionForm 
        onAddTransaction={addTransaction} 
        categories={allCategories} 
      />
      
      <HistoryList 
        transactions={transactions} 
        onDelete={deleteTransaction} 
      />
    </div>
  );
}

export default App;
