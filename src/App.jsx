import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import HistoryList from './components/HistoryList';
import ExpenseChart from './components/ExpenseChart';
import { supabase } from './supabaseClient';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Cargar categorías
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (catError) console.error('Error cargando categorías:', catError);
    else setCategories(catData || []);

    // 2. Cargar transacciones con el join de categorías
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          icon,
          color
        )
      `)
      .order('created_at', { ascending: false });

    if (txError) {
      console.error('Error cargando transacciones:', txError);
    } else if (txData) {
      setTransactions(txData);
    }
    setLoading(false);
  };

  // Cálculos derivados
  const ingresos = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, current) => acc + parseFloat(current.amount), 0);

  const gastos = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, current) => acc + parseFloat(current.amount), 0);

  const balance = ingresos - gastos;

  // Acciones (Interacción con Supabase)
  const handleAddTransaction = async (newTx) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        amount: newTx.amount,
        type: newTx.type,
        description: newTx.description,
        category_id: newTx.category_id
      }])
      .select(`
        *,
        categories (
          id,
          name,
          icon,
          color
        )
      `);

    if (error) {
      console.error('Error insertando la transacción:', error);
      alert('Error al guardar. Verifica que el SQL Editor se haya ejecutado.');
    } else if (data) {
      setTransactions([data[0], ...transactions]);
    }
  };

  const handleDeleteTransaction = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando la transacción:', error);
    } else {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p className="text-muted">Cargando datos de la nube...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Dashboard 
        balance={balance} 
        ingresos={ingresos} 
        gastos={gastos} 
      />

      <ExpenseChart transactions={transactions} />
      
      <TransactionForm 
        onAddTransaction={handleAddTransaction} 
        categories={categories}
      />

      <HistoryList 
        transactions={transactions} 
        onDelete={handleDeleteTransaction} 
      />
    </div>
  );
}

export default App;
