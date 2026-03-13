-- 1. Crear tabla de categorías
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL, -- Nombre del icono de Material Symbols
  color TEXT NOT NULL, -- Código hex para el color
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insertar categorías por defecto
INSERT INTO categories (name, icon, color, type) VALUES
('Alimentación', 'restaurant', '#FF9500', 'expense'),
('Transporte', 'directions_car', '#007AFF', 'expense'),
('Vivienda', 'home', '#AF52DE', 'expense'),
('Entretenimiento', 'movie', '#FF3B30', 'expense'),
('Salud', 'medical_services', '#34C759', 'expense'),
('Salario', 'payments', '#30D158', 'income'),
('Regalos', 'card_giftcard', '#FF2D55', 'both'),
('Otros', 'more_horiz', '#8E8E93', 'both');

-- 3. Actualizar la tabla de transacciones para incluir la categoría
ALTER TABLE transactions ADD COLUMN category_id UUID REFERENCES categories(id);

-- 4. Habilitar RLS para categorías
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura publica" ON categories FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica" ON categories FOR INSERT WITH CHECK (true);
