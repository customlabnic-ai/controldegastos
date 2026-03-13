import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom Hook: useFinance
 * Gestiona todo el estado financiero, filtrando por el usuario conectado.
 * @param {string} userId - ID del usuario actual de Supabase Auth.
 */
export function useFinance(userId) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga inicial de datos
  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Carga paralela de categorías, presupuestos, metas y cuentas (filtradas por user_id)
      const [catRes, budgetRes, goalRes, accRes] = await Promise.all([
        supabase.from('categories').select('*'), // Las categorías suelen ser compartidas o propias
        supabase.from('budgets').select('*').eq('user_id', userId),
        supabase.from('savings_goals').select('*').eq('user_id', userId),
        supabase.from('accounts').select('*').eq('user_id', userId)
      ]);

      if (catRes.error) throw catRes.error;
      if (budgetRes.error) throw budgetRes.error;
      if (goalRes.error) throw goalRes.error;
      if (accRes.error) throw accRes.error;

      setCategories(catRes.data || []);
      setBudgets(budgetRes.data || []);
      setGoals(goalRes.data || []);
      
      const loadedAccounts = accRes.data || [];
      setAccounts(loadedAccounts);
      
      if (loadedAccounts.length > 0 && !activeAccountId) {
        setActiveAccountId(loadedAccounts[0].id);
      }

      // Cargar transacciones del usuario
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select(`*, categories (id, name, icon, color)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (txError) throw txError;
      setTransactions(txData || []);

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al sincronizar datos privados.');
    } finally {
      setLoading(false);
    }
  }, [activeAccountId, userId]);

  // Cargar datos al montar o cambiar de usuario
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Acciones ---

  const addTransaction = async (newTx) => {
    if (!activeAccountId || !userId) return;
    try {
      const txToInsert = { ...newTx, account_id: activeAccountId, user_id: userId };
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([txToInsert])
        .select(`*, categories (id, name, icon, color)`);
      
      if (insertError) throw insertError;
      if (data) setTransactions(prev => [data[0], ...prev]);
      return { success: true };
    } catch (err) {
      setError('Error al guardar la transacción.');
      return { success: false, error: err };
    }
  };

  const updateBudget = async (categoryId, limit) => {
    if (!userId) return;
    try {
      const { data, error: upsertError } = await supabase
        .from('budgets')
        .upsert({ 
          category_id: categoryId, 
          amount_limit: limit, 
          user_id: userId 
        }, { onConflict: 'category_id, user_id' })
        .select();
      
      if (upsertError) throw upsertError;
      if (data) {
        setBudgets(prev => [...prev.filter(b => b.category_id !== categoryId), data[0]]);
      }
    } catch (err) {
      setError('Error al actualizar el presupuesto.');
    }
  };

  const addGoal = async (goal) => {
    if (!userId) return;
    try {
      const { data, error: goalError } = await supabase
        .from('savings_goals')
        .insert([{ ...goal, user_id: userId }])
        .select();
      
      if (goalError) throw goalError;
      if (data) setGoals(prev => [...prev, data[0]]);
    } catch (err) {
      setError('No se pudo añadir la meta.');
    }
  };

  const deleteGoal = async (id) => {
    try {
      const { error: goalError } = await supabase.from('savings_goals').delete().eq('id', id);
      if (goalError) throw goalError;
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setError('No se pudo eliminar la meta.');
    }
  };

  return {
    // Datos
    transactions: activeTransactions,
    allCategories: categories,
    budgets,
    goals,
    accounts,
    activeAccountId,
    totals,
    loading,
    error,
    
    // Acciones
    setActiveAccountId,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addGoal,
    deleteGoal,
    refreshData: fetchData
  };
}
