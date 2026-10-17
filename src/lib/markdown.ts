import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Article, Product, Service } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

function readFrontmatter<T>(relativePath: string): T {
  const file = fs.readFileSync(path.join(contentDirectory, relativePath), 'utf8');
  return matter(file).data as T;
}

export function getProducts(): Product[] {
  const files = ['light-roast.md', 'medium-roast.md', 'dark-roast.md'];
  return files.flatMap((file) => readFrontmatter<{ products: Product[] }>(`products/${file}`).products);
}

export function getServices(): Service[] {
  return readFrontmatter<{ services: Service[] }>('services.md').services;
}

export function getArticles(): Article[] {
  return readFrontmatter<{ articles: Article[] }>('articles.md').articles;
}

export function getSiteContent() {
  return {
    config: readFrontmatter<Record<string, any>>('config.md'),
    about: readFrontmatter<Record<string, any>>('about.md'),
  };
}