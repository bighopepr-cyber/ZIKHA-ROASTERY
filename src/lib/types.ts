export type Product = {
  id: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  beanType: 'Robusta' | 'Arabica' | 'Blend';
  roastLevel: 'Light' | 'Medium' | 'Dark';
  process: string;
  tastingNotes: string[];
  description: string;
  english?: { description?: string };
  image: string;
  stock: boolean;
};

export type Service = {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  icon: string;
  popular: boolean;
  english?: { description?: string; features?: string[] };
};

export type Article = {
  category: string;
  title: string;
  date: string;
  image: string;
  body: string;
  english?: { category?: string; title?: string; date?: string; body?: string };
};