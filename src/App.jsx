import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import HistoryList from './components/HistoryList';
import ExpenseChart from './components/ExpenseChart';
import BudgetTracker from './components/BudgetTracker';
import SavingsGoals from './components/SavingsGoals';
import AccountSwitcher from './components/AccountSwitcher';
import { supabase } from './supabaseClient';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Cargar Cat, Budgets, Goals, Accounts
    const [catRes, budgetRes, goalRes, accRes] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('budgets').select('*'),
      supabase.from('savings_goals').select('*'),
      supabase.from('accounts').select('*')
    ]);

    setCategories(catRes.data || []);
    setBudgets(budgetRes.data || []);
    setGoals(goalRes.data || []);
    const loadedAccounts = accRes.data || [];
    setAccounts(loadedAccounts);
    
    if (loadedAccounts.length > 0 && !activeAccountId) {
      setActiveAccountId(loadedAccounts[0].id);
    }

    // Cargar transacciones
    const { data: txData } = await supabase
      .from('transactions')
      .select(`*, categories (id, name, icon, color)`)
      .order('created_at', { ascending: false });
    setTransactions(txData || []);

    setLoading(false);
  };

  // Filtrar datos según cuenta activa
  const activeTransactions = transactions.filter(t => t.account_id === activeAccountId);

  // Cálculos dinámicos
  const ingresos = activeTransactions.filter(t => t.type === 'income').reduce((acc, c) => acc + parseFloat(c.amount), 0);
  const gastos = activeTransactions.filter(t => t.type === 'expense').reduce((acc, c) => acc + parseFloat(c.amount), 0);
  const balance = ingresos - gastos;

  // Acciones
  const handleAddTransaction = async (newTx) => {
    const txToInsert = { ...newTx, account_id: activeAccountId };
    const { data } = await supabase.from('transactions').insert([txToInsert]).select(`*, categories (id, name, icon, color)`);
    if (data) setTransactions([data[0], ...transactions]);
  };

  const handleDeleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleUpdateBudget = async (categoryId, limit) => {
    const { data } = await supabase.from('budgets').upsert({ category_id: categoryId, amount_limit: limit }, { onConflict: 'category_id' }).select();
    if (data) setBudgets([...budgets.filter(b => b.category_id !== categoryId), data[0]]);
  };

  const handleAddGoal = async (goal) => {
    const { data } = await supabase.from('savings_goals').insert([goal]).select();
    if (data) setGoals([...goals, data[0]]);
  };

  const handleDeleteGoal = async (id) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (!error) setGoals(goals.filter(g => g.id !== id));
  };

  if (loading) return <div className="app-container flex-center" style={{height:'100vh'}}>Sincronizando...</div>;

  return (
    <div className="app-container">
      <Dashboard balance={balance} ingresos={ingresos} gastos={gastos} />
      
      <AccountSwitcher 
        accounts={accounts} 
        activeAccountId={activeAccountId} 
        onSelectAccount={setActiveAccountId}
        totalBalance={balance}
      />

      <ExpenseChart transactions={activeTransactions} />
      <BudgetTracker categories={categories} transactions={activeTransactions} budgets={budgets} onUpdateBudget={handleUpdateBudget} />
      <SavingsGoals goals={goals} transactions={activeTransactions} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} />
      <TransactionForm onAddTransaction={handleAddTransaction} categories={categories} />
      <HistoryList transactions={activeTransactions} onDelete={handleDeleteTransaction} />
    </div>
  );
}

export default App;
