-- ========================================================
-- SCRIPT DE REPARACIÓN TOTAL Y FASE 2 CONSOLIDADO
-- Ejecuta esto una sola vez en el SQL Editor de Supabase
-- ========================================================

-- 1. Habilitar extensión necesaria
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla de CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Crear tabla de CUENTAS
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'credit', 'other')),
  balance DECIMAL(12,2) DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#007AFF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Crear tabla de METAS DE AHORRO
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'star',
  color TEXT NOT NULL DEFAULT '#007AFF',
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Crear tabla de PRESUPUESTOS (Budgets)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) UNIQUE,
  amount_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  month_year DATE DEFAULT (current_date - interval '1 day' * (extract(day from current_date) - 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Modificar tabla de TRANSACCIONES
-- Asegurar que existan las columnas de relación
DO $$ 
BEGIN 
    -- Columna de categoría
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='category_id') THEN
        ALTER TABLE transactions ADD COLUMN category_id UUID REFERENCES categories(id);
    END IF;
    
    -- Columna de cuenta
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='account_id') THEN
        ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts(id);
    END IF;
END $$;

-- 7. Insertar Datos de Inicio (Solo si están vacíos)
INSERT INTO categories (name, icon, color, type)
SELECT 'Alimentación', 'restaurant', '#FF9500', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Alimentación');
INSERT INTO categories (name, icon, color, type)
SELECT 'Transporte', 'directions_car', '#007AFF', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transporte');
INSERT INTO categories (name, icon, color, type)
SELECT 'Vivienda', 'home', '#AF52DE', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Vivienda');
INSERT INTO categories (name, icon, color, type)
SELECT 'Otros', 'more_horiz', '#8E8E93', 'both' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Otros');

INSERT INTO accounts (name, type, balance, color) 
SELECT 'Efectivo', 'cash', 0, '#34C759' WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE name = 'Efectivo');
INSERT INTO accounts (name, type, balance, color) 
SELECT 'Banco', 'bank', 0, '#007AFF' WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE name = 'Banco');

-- 8. Limpieza de datos (Asignar cuenta por defecto a huérfanos)
UPDATE transactions SET account_id = (SELECT id FROM accounts WHERE name = 'Efectivo' LIMIT 1) WHERE account_id IS NULL;

-- 9. Habilitar RLS en TODO
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 10. Políticas de acceso (Públicas)
DROP POLICY IF EXISTS "Public Read" ON categories; CREATE POLICY "Public Read" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Full" ON categories; CREATE POLICY "Public Full" ON categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read" ON accounts; CREATE POLICY "Public Read" ON accounts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Full" ON accounts; CREATE POLICY "Public Full" ON accounts FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read" ON savings_goals; CREATE POLICY "Public Read" ON savings_goals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Full" ON savings_goals; CREATE POLICY "Public Full" ON savings_goals FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read" ON budgets; CREATE POLICY "Public Read" ON budgets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Full" ON budgets; CREATE POLICY "Public Full" ON budgets FOR ALL USING (true);
