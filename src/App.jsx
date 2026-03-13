import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import HistoryList from './components/HistoryList';
import ExpenseChart from './components/ExpenseChart';
import BudgetTracker from './components/BudgetTracker';
import SavingsGoals from './components/SavingsGoals';
import { supabase } from './supabaseClient';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Cargar categorías
    const { data: catData } = await supabase.from('categories').select('*');
    setCategories(catData || []);

    // 2. Cargar presupuestos
    const { data: budgetData } = await supabase.from('budgets').select('*');
    setBudgets(budgetData || []);

    // 3. Cargar metas de ahorro
    const { data: goalData } = await supabase.from('savings_goals').select('*');
    setGoals(goalData || []);

    // 4. Cargar transacciones
    const { data: txData } = await supabase
      .from('transactions')
      .select(`*, categories (id, name, icon, color)`)
      .order('created_at', { ascending: false });
    setTransactions(txData || []);

    setLoading(false);
  };

  // Cálculos
  const ingresos = transactions.filter(t => t.type === 'income').reduce((acc, c) => acc + parseFloat(c.amount), 0);
  const gastos = transactions.filter(t => t.type === 'expense').reduce((acc, c) => acc + parseFloat(c.amount), 0);
  const balance = ingresos - gastos;

  // Acciones Transacciones
  const handleAddTransaction = async (newTx) => {
    const { data } = await supabase.from('transactions').insert([newTx]).select(`*, categories (id, name, icon, color)`);
    if (data) setTransactions([data[0], ...transactions]);
  };

  const handleDeleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(transactions.filter(t => t.id !== id));
  };

  // Acciones Presupuestos
  const handleUpdateBudget = async (categoryId, limit) => {
    const { data } = await supabase.from('budgets').upsert({ category_id: categoryId, amount_limit: limit }, { onConflict: 'category_id' }).select();
    if (data) {
      setBudgets([...budgets.filter(b => b.category_id !== categoryId), data[0]]);
    }
  };

  // Acciones Metas
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
      <ExpenseChart transactions={transactions} />
      <BudgetTracker categories={categories} transactions={transactions} budgets={budgets} onUpdateBudget={handleUpdateBudget} />
      <SavingsGoals goals={goals} transactions={transactions} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} />
      <TransactionForm onAddTransaction={handleAddTransaction} categories={categories} />
      <HistoryList transactions={transactions} onDelete={handleDeleteTransaction} />
    </div>
  );
}

export default App;
