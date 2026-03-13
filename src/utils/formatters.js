/**
 * Utilidades para formatear datos en la aplicación.
 * Centralizar esto ayuda a mantener la consistencia en toda la interfaz.
 */

/**
 * Formatea un número como moneda (USD por defecto).
 * @param {number} amount - El monto a formatear.
 * @returns {string} - Monto formateado (ej. $1,250.00).
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea una fecha de Supabase a un formato legible.
 * @param {string} dateString - Fecha en formato ISO.
 * @returns {string} - Fecha legible (ej. 12 mar 2024).
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
