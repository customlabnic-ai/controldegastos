import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import HistoryList from './components/HistoryList';
import { supabase } from './supabaseClient';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar datos iniciales desde Supabase
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando transacciones:', error);
    } else if (data) {
      setTransactions(data);
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
    // 1. Guardar en Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        amount: newTx.amount,
        type: newTx.type,
        description: newTx.description
      }])
      .select();

    if (error) {
      console.error('Error insertando la transacción:', error);
      alert('Hubo un error al guardar el registro. Verifica que el SQL Editor se haya ejecutado en Supabase.');
    } else if (data) {
      // 2. Si se guardó correctamente, actualizar la lista en pantalla
      setTransactions([data[0], ...transactions]);
    }
  };

  const handleDeleteTransaction = async (id) => {
    // 1. Eliminar en Supabase
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando la transacción:', error);
    } else {
      // 2. Eliminar de la pantalla
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
      
      <TransactionForm 
        onAddTransaction={handleAddTransaction} 
      />

      <HistoryList 
        transactions={transactions} 
        onDelete={handleDeleteTransaction} 
      />
    </div>
  );
}

export default App;
