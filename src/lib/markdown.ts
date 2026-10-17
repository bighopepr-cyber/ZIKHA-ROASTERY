import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  AboutContent,
  Article,
  Product,
  Service,
  SiteConfig,
} from "./types";

const contentDirectory = path.join(process.cwd(), "content");

function readFrontmatter<T>(relativePath: string): T {
  const file = fs.readFileSync(
    path.join(contentDirectory, relativePath),
    "utf8",
  );
  return matter(file).data as T;
}

export function getProducts(): Product[] {
  const files = ["light-roast.md", "medium-roast.md", "dark-roast.md"];
  return files.flatMap(
    (file) =>
      readFrontmatter<{ products: Product[] }>(`products/${file}`).products,
  );
}

export function getServices(): Service[] {
  return readFrontmatter<{ services: Service[] }>("services.md").services;
}

export function getArticles(): Article[] {
  return readFrontmatter<{ articles: Article[] }>("articles.md").articles;
}

export function getSiteContent() {
  return {
    config: readFrontmatter<SiteConfig>("config.md"),
    about: readFrontmatter<AboutContent>("about.md"),
  };
}
