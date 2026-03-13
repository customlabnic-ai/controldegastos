-- SQL PARA CONFIGURAR LA AUTENTICACIÓN Y SEGURIDAD (RLS)
-- Copia este código EXACTAMENTE como está en el SQL Editor de Supabase y dale a RUN.

-- 1. Añadir columna user_id a las tablas
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE savings_goals ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Activar Seguridad de Filas (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas de Seguridad (Solo el dueño ve sus datos)
DROP POLICY IF EXISTS "Usuarios ven sus propias transacciones" ON transactions;
CREATE POLICY "Usuarios ven sus propias transacciones" ON transactions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios ven sus propios presupuestos" ON budgets;
CREATE POLICY "Usuarios ven sus propios presupuestos" ON budgets FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios ven sus propias cuentas" ON accounts;
CREATE POLICY "Usuarios ven sus propias cuentas" ON accounts FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios ven sus propias metas" ON savings_goals;
CREATE POLICY "Usuarios ven sus propias metas" ON savings_goals FOR ALL USING (auth.uid() = user_id);
