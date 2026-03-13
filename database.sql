-- 1. Crear tabla de Transacciones (transactions)
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar Seguridad de Nivel de Fila (RLS) para poder leer/escribir publicamente 
-- (Como no hay usuarios todavía, dejaremos la base pública para hacer pruebas)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica" ON transactions FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion publica" ON transactions FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminacion publica" ON transactions FOR DELETE USING (true);
