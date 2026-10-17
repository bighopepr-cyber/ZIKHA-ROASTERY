export type Product = {
  id: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  beanType: "Robusta" | "Arabica" | "Blend";
  roastLevel: "Light" | "Medium" | "Dark";
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
  youtubeUrl?: string;
  english?: { category?: string; title?: string; date?: string; body?: string };
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  currency: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
  operationalHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  shipping: {
    available: boolean;
    areas: string;
    estimate: string;
    cost: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
};

export type RoasteryValue = {
  title: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
};

export type AboutContent = {
  title: string;
  mission: string;
  missionEn: string;
  vision: string;
  visionEn: string;
  values: RoasteryValue[];
  story: string;
  storyEn: string;
};
