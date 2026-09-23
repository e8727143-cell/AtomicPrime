/**
 * Currency utilities for Uruguayan Pesos (UYU / $U)
 */

export const formatUYU = (amount: number): string => {
  return `$U ${Math.round(amount).toLocaleString('es-UY')}`;
};

export const FREE_SHIPPING_THRESHOLD_UYU = 3000; // Envío gratis a partir de $U 3.000
export const STANDARD_SHIPPING_FEE_UYU = 250; // Envío estándar a todo Uruguay $U 250
