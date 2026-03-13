-- ==========================================
-- SCRIPT DE ACTUALIZACIÓN: METAS DE AHORRO
-- ==========================================

-- 1. Crear tabla de metas de ahorro
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'star', -- Icono de Material Symbols
  color TEXT NOT NULL DEFAULT '#007AFF', -- Color hex
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar RLS
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso público
DROP POLICY IF EXISTS "Permitir lectura publica" ON savings_goals;
CREATE POLICY "Permitir lectura publica" ON savings_goals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Permitir todo publico" ON savings_goals;
CREATE POLICY "Permitir todo publico" ON savings_goals FOR ALL USING (true);
