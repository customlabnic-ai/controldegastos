-- ==========================================
-- SCRIPT DE ACTUALIZACIÓN: FASE 2 PREMIUM
-- ==========================================

-- 1. Crear tabla de categorías (si no existe)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insertar categorías por defecto (solo si la tabla está vacía)
INSERT INTO categories (name, icon, color, type)
SELECT 'Alimentación', 'restaurant', '#FF9500', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Alimentación');
INSERT INTO categories (name, icon, color, type)
SELECT 'Transporte', 'directions_car', '#007AFF', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transporte');
INSERT INTO categories (name, icon, color, type)
SELECT 'Vivienda', 'home', '#AF52DE', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Vivienda');
INSERT INTO categories (name, icon, color, type)
SELECT 'Entretenimiento', 'movie', '#FF3B30', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Entretenimiento');
INSERT INTO categories (name, icon, color, type)
SELECT 'Salud', 'medical_services', '#34C759', 'expense' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Salud');
INSERT INTO categories (name, icon, color, type)
SELECT 'Salario', 'payments', '#30D158', 'income' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Salario');
INSERT INTO categories (name, icon, color, type)
SELECT 'Regalos', 'card_giftcard', '#FF2D55', 'both' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Regalos');
INSERT INTO categories (name, icon, color, type)
SELECT 'Otros', 'more_horiz', '#8E8E93', 'both' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Otros');

-- 3. Actualizar la tabla de transacciones para incluir category_id
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='category_id') THEN
        ALTER TABLE transactions ADD COLUMN category_id UUID REFERENCES categories(id);
    END IF;
END $$;

-- 4. NUEVA TABLA: Presupuestos (Budgets)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) UNIQUE, -- Un presupuesto por categoría
  amount_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  month_year DATE DEFAULT (current_date - interval '1 day' * (extract(day from current_date) - 1)), -- El primer día del mes actual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de acceso (Públicas para Fase 1/2)
DROP POLICY IF EXISTS "Permitir lectura publica" ON categories;
CREATE POLICY "Permitir lectura publica" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir insercion publica" ON categories;
CREATE POLICY "Permitir insercion publica" ON categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura publica" ON budgets;
CREATE POLICY "Permitir lectura publica" ON budgets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir upsert publico" ON budgets;
CREATE POLICY "Permitir upsert publico" ON budgets FOR ALL USING (true);
