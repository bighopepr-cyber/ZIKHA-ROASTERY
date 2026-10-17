import Storefront from '@/app/components/Storefront';
import { getArticles, getProducts, getServices, getSiteContent } from '@/lib/markdown';

export default function HomePage() {
  const products = getProducts();
  const services = getServices();
  const articles = getArticles();
  const { config, about } = getSiteContent();

  return <Storefront products={products} services={services} articles={articles} config={config} about={about} />;
}