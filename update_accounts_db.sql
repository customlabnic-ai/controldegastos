-- ==========================================
-- SCRIPT DE ACTUALIZACIÓN: MULTI-CUENTAS
-- ==========================================

-- 1. Crear tabla de cuentas
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'credit', 'other')),
  balance DECIMAL(12,2) DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#007AFF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insertar cuentas por defecto
INSERT INTO accounts (name, type, balance, color) 
SELECT 'Efectivo', 'cash', 0, '#34C759' WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE name = 'Efectivo');
INSERT INTO accounts (name, type, balance, color) 
SELECT 'Banco', 'bank', 0, '#007AFF' WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE name = 'Banco');

-- 3. Modificar tabla de transacciones para vincular a una cuenta
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='account_id') THEN
        ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts(id);
        
        -- Asignar la cuenta "Efectivo" a las transacciones existentes por defecto
        UPDATE transactions SET account_id = (SELECT id FROM accounts WHERE name = 'Efectivo' LIMIT 1);
    END IF;
END $$;

-- 4. Habilitar RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 5. Políticas públicas
DROP POLICY IF EXISTS "Permitir lectura publica" ON accounts;
CREATE POLICY "Permitir lectura publica" ON accounts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir todo publico" ON accounts;
CREATE POLICY "Permitir todo publico" ON accounts FOR ALL USING (true);
