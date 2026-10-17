import { translations, type Locale } from './translations';
import type { Product } from './types';

const currencyFormatters: Record<Locale, Intl.NumberFormat> = {
  id: new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }),
  en: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }),
};

export function formatCurrency(price: number, locale: Locale): string {
  return currencyFormatters[locale].format(price);
}

export function getBeanLabel(value: Product['beanType'], locale: Locale): string {
  const labels = translations[locale];
  return value === 'Blend' ? labels.blend : value === 'Arabica' ? labels.arabica : labels.robusta;
}

export function getRoastLabel(value: Product['roastLevel'], locale: Locale): string {
  const labels = translations[locale];
  return value === 'Light' ? labels.light : value === 'Medium' ? labels.medium : labels.dark;
}