"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Coffee,
  Flame,
  Heart,
  Instagram,
  Leaf,
  Minus,
  Moon,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Article, Product, Service } from "@/lib/types";
import { translations, type Locale } from "@/lib/translations";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type Props = {
  products: Product[];
  services: Service[];
  articles: Article[];
  config: Record<string, any>;
  about: Record<string, any>;
};
type CartLine = { id: string; quantity: number };
type LazyImageProps = { src: string; alt: string; className?: string };
const money = (price: number, locale: Locale = "id") =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
const heroImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=90";
const detailImages = [
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85",
];

function LazyImage({ src, alt, className = "" }: LazyImageProps) {
  const [state, setState] = useState("is-loading");

  return (
    <span className={`lazy-image ${state} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setState("is-loaded")}
        onError={() => setState("has-error")}
      />
    </span>
  );
}
export default function Storefront({
  products,
  services,
  articles,
  config,
  about,
}: Props) {
  const [locale, setLocale] = useState<Locale>("id");
  const [query, setQuery] = useState("");
  const [roast, setRoast] = useState("all");
  const [bean, setBean] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<
    (typeof articles)[number] | null
  >(null);
  const [detailImage, setDetailImage] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileNav, setMobileNav] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const t = translations[locale];
  const activeTestimonials = t.testimonials;
  const activeTestimonial = activeTestimonials[testimonialIndex];
  const selectedArticleVideo = getYouTubeEmbedUrl(selectedArticle?.youtubeUrl);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("zikha-cart");
      const storedTheme = localStorage.getItem("zikha-theme");
      const storedLocale = localStorage.getItem("zikha-locale");
      if (storedCart) setCart(JSON.parse(storedCart) as CartLine[]);
      if (storedTheme === "dark" || storedTheme === "light")
        setTheme(storedTheme);
      if (storedLocale === "en" || storedLocale === "id")
        setLocale(storedLocale);
    } catch {
      localStorage.removeItem("zikha-cart");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("zikha-cart", JSON.stringify(cart));
    localStorage.setItem("zikha-theme", theme);
    localStorage.setItem("zikha-locale", locale);
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    document.documentElement.lang = locale;
    document.title = t.documentTitle;
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute("content", t.documentDescription);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.setAttribute("content", t.documentTitle);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:description"]')
      ?.setAttribute("content", t.documentDescription);
  }, [cart, theme, locale, hydrated]);

  useEffect(() => {
    if (!selected && !selectedArticle && !cartOpen && !compareOpen) return;
    const dialogs = document.querySelectorAll<HTMLElement>(
      ".overlay [role='dialog']",
    );
    const dialog = dialogs[dialogs.length - 1];
    if (!dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

    getFocusableElements()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setSelectedArticle(null);
        setCartOpen(false);
        setCompareOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [selected, selectedArticle, cartOpen, compareOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (event.target as HTMLElement).tagName,
        )
      ) {
        event.preventDefault();
        document
          .querySelector<HTMLInputElement>(".search-field input")
          ?.focus();
        document
          .querySelector("#katalog")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (selected) setDetailImage(selected.image);
  }, [selected]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const needle = query.trim().toLowerCase();
        const matchesText =
          !needle ||
          [
            product.name,
            product.origin,
            product.beanType,
            product.roastLevel,
            ...product.tastingNotes,
          ].some((value) => value.toLowerCase().includes(needle));
        return (
          matchesText &&
          (roast === "all" || product.roastLevel === roast) &&
          (bean === "all" || product.beanType === bean)
        );
      }),
    [products, query, roast, bean],
  );

  const cartProducts = cart
    .map((line) => ({
      ...line,
      product: products.find((item) => item.id === line.id),
    }))
    .filter((line): line is CartLine & { product: Product } =>
      Boolean(line.product),
    );
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartProducts.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const comparedProducts = compareIds
    .map((id) => products.find((product) => product.id === id))
    .filter((item): item is Product => Boolean(item));
  const whatsapp = config?.contact?.whatsapp ?? "6281234567890";
  const checkoutMessage =
    locale === "en"
      ? `Hello ZIKHA ROASTERY, I would like to place an order:\n${cartProducts.map(({ product, quantity }) => `- ${product.name} (${product.weight}) x${quantity}`).join("\n")}\n\nSubtotal: ${money(cartTotal, locale)}\nPlease let me know the shipping cost and payment details.`
      : `Halo ZIKHA ROASTERY, saya ingin memesan:\n${cartProducts.map(({ product, quantity }) => `- ${product.name} (${product.weight}) x${quantity}`).join("\n")}\n\nTotal produk: ${money(cartTotal, locale)}\nMohon info ongkir dan cara pembayarannya.`;

  const labelBean = (value: Product["beanType"]) =>
    value === "Blend" ? t.blend : value === "Arabica" ? t.arabica : t.robusta;
  const labelRoast = (value: Product["roastLevel"]) =>
    value === "Light" ? t.light : value === "Medium" ? t.medium : t.dark;

  function addToCart(product: Product) {
    setCart((current) =>
      current.some((line) => line.id === product.id)
        ? current.map((line) =>
            line.id === product.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { id: product.id, quantity: 1 }],
    );
  }
  function changeQuantity(id: string, amount: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + amount } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }
  function toggleCompare(product: Product) {
    setCompareIds((current) =>
      current.includes(product.id)
        ? current.filter((id) => id !== product.id)
        : current.length < 3
          ? [...current, product.id]
          : current,
    );
  }
  function jumpToCatalog() {
    document.querySelector("#katalog")?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>{t.announcement}</span>
        <span>{t.deliveryNote}</span>
      </div>
      <header className="site-header">
        <a href="#beranda" className="brand" aria-label={t.home}>
          <span className="brand-mark">
            <Coffee size={20} strokeWidth={1.7} />
          </span>
          <span>
            ZIKHA<span className="brand-light">ROASTERY</span>
          </span>
        </a>
        <nav
          className={mobileNav ? "main-nav nav-open" : "main-nav"}
          aria-label={t.openMenu}
        >
          <a href="#cerita" onClick={() => setMobileNav(false)}>
            {t.navStory}
          </a>
          <a href="#katalog" onClick={() => setMobileNav(false)}>
            {t.navCoffee}
          </a>
          <a href="#roasting" onClick={() => setMobileNav(false)}>
            {t.navRoasting}
          </a>
          <a href="#jurnal" onClick={() => setMobileNav(false)}>
            {t.navJournal}
          </a>
        </nav>
        <div className="header-actions">
          <label className="language-picker">
            <span className="sr-only">{t.language}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              aria-label={t.language}
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
            </select>
            <ChevronDown size={12} />
          </label>
          <button
            className="icon-button theme-button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? t.darkTheme : t.lightTheme}
            title={theme === "light" ? t.darkTheme : t.lightTheme}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`${t.openCart}, ${cartCount}`}
          >
            <ShoppingBag size={18} />
            <span>{t.cart}</span>
            <b>{cartCount}</b>
          </button>
          <button
            className="menu-toggle icon-button"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label={mobileNav ? t.closeMenu : t.openMenu}
          >
            {mobileNav ? <X size={20} /> : <span className="menu-lines" />}
          </button>
        </div>
      </header>

      <main>
        <section
          className="hero"
          id="beranda"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(23,35,27,.85) 0%, rgba(23,35,27,.56) 43%, rgba(23,35,27,.08) 100%), url("${heroImage}")`,
          }}
        >
          <div className="hero-content">
            <p className="eyebrow light-eyebrow">
              <span /> {t.heroEyebrow}
            </p>
            <h1>
              {t.heroStart}
              <br />
              <em>{t.heroEmphasis}</em> {t.heroEnd}
            </h1>
            <p className="hero-copy">{t.heroCopy}</p>
            <div className="hero-actions">
              <button className="button button-lime" onClick={jumpToCatalog}>
                {t.exploreCoffee} <ArrowRight size={17} />
              </button>
              <a href="#cerita" className="text-link light-link">
                {t.meetStory} <ArrowDown size={15} />
              </a>
            </div>
          </div>
          <div className="hero-side-note">
            <span>01 / 03</span>
            <span>{t.heroSide}</span>
            <span>{t.heroLocation}</span>
          </div>
          <div className="hero-stamp">
            <span>
              GOOD
              <br />
              GROUNDS
            </span>
            <Leaf size={20} />
          </div>
        </section>

        <section className="ticker" aria-label="Nilai ZIKHA ROASTERY">
          <div className="ticker-track">
            <span>TRACEABLE ORIGIN</span>
            <i>✳</i>
            <span>ROASTED WITH CARE</span>
            <i>✳</i>
            <span>GROWING GOODNESS</span>
            <i>✳</i>
            <span>TRACEABLE ORIGIN</span>
            <i>✳</i>
            <span>ROASTED WITH CARE</span>
            <i>✳</i>
            <span>GROWING GOODNESS</span>
            <i>✳</i>
          </div>
        </section>

        <section className="intro-section section-wrap" id="cerita">
          <div className="intro-label">
            <span className="section-index">01</span>
            <span className="eyebrow">{t.introEyebrow}</span>
          </div>
          <div className="intro-main">
            <h2>
              {t.introStart}
              <br />
              {t.introEnd} <em>{t.introEmphasis}</em>
            </h2>
            <div className="intro-copy">
              <p>{locale === "en" ? about?.storyEn : about?.story}</p>
              <a className="text-link" href="#roasting">
                {t.introLink} <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="values-row">
            {(about?.values ?? []).map(
              (
                value: {
                  title: string;
                  description: string;
                  titleEn?: string;
                  descriptionEn?: string;
                },
                index: number,
              ) => (
                <div className="value-item" key={value.title}>
                  <span>0{index + 1}</span>
                  <h3>
                    {locale === "en"
                      ? (value.titleEn ?? value.title)
                      : value.title}
                  </h3>
                  <p>
                    {locale === "en"
                      ? (value.descriptionEn ?? value.description)
                      : value.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="catalog-section" id="katalog">
          <div className="section-wrap">
            <div className="section-heading catalog-heading">
              <div>
                <span className="eyebrow">
                  <span className="section-index">02</span> {t.catalogEyebrow}
                </span>
                <h2>
                  {t.catalogStart} <em>{t.catalogEmphasis}</em>
                </h2>
              </div>
              <p>{t.catalogCopy}</p>
            </div>
            <div className="catalog-toolbar">
              <label className="search-field">
                <Search size={17} />
                <input
                  aria-label={t.searchAria}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.searchPlaceholder}
                />
                <kbd>/</kbd>
              </label>
              <label className="select-field">
                <SlidersHorizontal size={16} />
                <select
                  aria-label={t.filterRoast}
                  value={roast}
                  onChange={(event) => setRoast(event.target.value)}
                >
                  <option value="all">{t.allRoasts}</option>
                  <option value="Light">{t.light}</option>
                  <option value="Medium">{t.medium}</option>
                  <option value="Dark">{t.dark}</option>
                </select>
                <ChevronDown size={14} />
              </label>
              <label className="select-field bean-select">
                <select
                  aria-label={t.filterBean}
                  value={bean}
                  onChange={(event) => setBean(event.target.value)}
                >
                  <option value="all">{t.allBeans}</option>
                  <option value="Arabica">{t.arabica}</option>
                  <option value="Robusta">{t.robusta}</option>
                  <option value="Blend">{t.blend}</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            <div className="catalog-meta">
              <span>
                {filteredProducts.length} {t.resultCount}
              </span>
              <span>{t.priceNote}</span>
            </div>
            {filteredProducts.length ? (
              <div className="product-grid">
                {filteredProducts.map((product, index) => {
                  const isCompared = compareIds.includes(product.id);
                  return (
                    <motion.article
                      className="product-card"
                      key={product.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.42, delay: (index % 3) * 0.08 }}
                    >
                      <button
                        className="product-image"
                        onClick={() => setSelected(product)}
                        aria-label={`${t.viewDetails} ${product.name}`}
                      >
                        <LazyImage src={product.image} alt="" />
                        <span className="roast-badge">
                          {labelRoast(product.roastLevel)} {t.roastSuffix}
                        </span>
                        <span className="image-arrow">
                          <ArrowUpRight size={19} />
                        </span>
                      </button>
                      <div className="product-info">
                        <div className="product-title-row">
                          <div>
                            <span className="product-origin">
                              {product.origin} · {labelBean(product.beanType)}
                            </span>
                            <h3>
                              <button onClick={() => setSelected(product)}>
                                {product.name}
                              </button>
                            </h3>
                          </div>
                          <button
                            className={
                              isCompared
                                ? "compare-check selected"
                                : "compare-check"
                            }
                            onClick={() => toggleCompare(product)}
                            aria-label={
                              isCompared
                                ? `${t.removeCompare} ${product.name}`
                                : `${t.compare} ${product.name}`
                            }
                            title={
                              compareIds.length >= 3 && !isCompared
                                ? t.compareLimit
                                : t.compareHint
                            }
                            disabled={compareIds.length >= 3 && !isCompared}
                          >
                            {isCompared ? (
                              <Check size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        </div>
                        <div className="tasting-notes">
                          {product.tastingNotes.map((note) => (
                            <span key={note}>{note}</span>
                          ))}
                        </div>
                        <div className="product-bottom">
                          <strong>{money(product.price, locale)}</strong>
                          <span>/{product.weight}</span>
                          <button
                            className="add-button"
                            onClick={() => {
                              addToCart(product);
                              setCartOpen(true);
                            }}
                            aria-label={`${t.addToCart} ${product.name}`}
                          >
                            <Plus size={19} />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-results">
                <Coffee size={27} />
                <p>{t.noResults}</p>
                <button
                  className="text-link"
                  onClick={() => {
                    setQuery("");
                    setRoast("all");
                    setBean("all");
                  }}
                >
                  {t.resetFilters} <ArrowRight size={15} />
                </button>
              </div>
            )}
            <div className="catalog-footnote">
              <span>
                <Leaf size={15} /> {t.freshCoffee}
              </span>
              <button
                className="text-link"
                onClick={() => {
                  setQuery("");
                  setRoast("all");
                  setBean("all");
                }}
              >
                {t.seeAllCoffee} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="roasting-section" id="roasting">
          <div
            className="roasting-photo"
            role="img"
            aria-label="Biji kopi sedang disiapkan untuk proses roasting"
          >
            <LazyImage
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1300&q=90"
              alt=""
            />
          </div>
          <div className="roasting-content">
            <span className="eyebrow light-eyebrow">
              <span className="section-index">03</span> {t.roastingEyebrow}
            </span>
            <h2>
              {t.roastingStart}
              <br />
              <em>{t.roastingEmphasis}</em> {t.roastingEnd}
            </h2>
            <p>{t.roastingCopy}</p>
            <div className="service-list">
              {services.map((service) => (
                <div className="service-row" key={service.id}>
                  <div className="service-icon">
                    {service.icon === "sun" ? (
                      <Sun size={19} />
                    ) : service.icon === "flame" ? (
                      <Flame size={19} />
                    ) : (
                      <Coffee size={19} />
                    )}
                  </div>
                  <div className="service-description">
                    <h3>
                      {service.name}
                      {service.popular && <span>{t.popular}</span>}
                    </h3>
                    <p>{locale === "en" ? service.english?.description ?? service.description : service.description}</p>
                    <div>
                      {(locale === "en" ? service.english?.features ?? service.features : service.features).map((feature) => (
                        <i key={feature}>{feature}</i>
                      ))}
                    </div>
                  </div>
                  <strong>
                    {money(service.price, locale)}
                    <small> / {service.unit}</small>
                  </strong>
                </div>
              ))}
            </div>
            <a
              className="button button-lime"
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(t.consultMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              {t.discussRoasting} <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section className="quote-section">
          <div className="quote-mark">“</div>
          <blockquote>
            {t.quote}
          </blockquote>
          <div className="quote-attribution">
            <span className="quote-rule" /> {t.quoteAttribution}
          </div>
          <div className="quote-orbit" aria-hidden="true">
            Z
          </div>
        </section>

        <section className="journal-section section-wrap" id="jurnal">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="section-index">04</span> {t.journalEyebrow}
              </span>
              <h2>
                {t.journalStart} <em>{t.journalEmphasis}</em>
              </h2>
            </div>
            <button
              className="text-link"
              onClick={() => setSelectedArticle(articles[0])}
            >
              {t.readStories} <ArrowRight size={16} />
            </button>
          </div>
          <div className="journal-grid">
            {articles.map((article, index) => (
              <article className="journal-card" key={article.title}>
                <button
                  type="button"
                  className="journal-image"
                  onClick={() => setSelectedArticle(article)}
                  aria-label={`${t.readArticle}: ${locale === "en" ? article.english?.title ?? article.title : article.title}`}
                >
                  <LazyImage
                    src={article.image}
                    alt={locale === "en" ? article.english?.title ?? article.title : article.title}
                  />
                  <span>0{index + 1}</span>
                  <ArrowUpRight size={18} />
                </button>
                <div className="journal-meta">
                  <span>{locale === "en" ? article.english?.category ?? article.category : article.category}</span>
                  <span>{locale === "en" ? article.english?.date ?? article.date : article.date}</span>
                </div>
                <h3>
                  <button
                    className="journal-link"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {locale === "en" ? article.english?.title ?? article.title : article.title}
                  </button>
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section
          className="testimonial-section"
          aria-roledescription="carousel"
          aria-label={t.testimonialEyebrow}
        >
          <div className="testimonial-top">
            <span className="eyebrow">
              <span className="section-index">05</span> {t.testimonialEyebrow}
            </span>
            <div className="rating">
              <span>★★★★★</span> {t.rating}
            </div>
          </div>
          <div className="testimonial-body" aria-live="polite">
            <blockquote>“{activeTestimonial.quote}”</blockquote>
            <div className="reviewer">
              <span className="reviewer-avatar">
                {activeTestimonial.initials}
              </span>
              <span>
                <b>{activeTestimonial.name}</b>
                <small>{activeTestimonial.since}</small>
              </span>
              <span className="reviewer-product">
                {activeTestimonial.product}
              </span>
            </div>
            <div className="testimonial-controls">
              <span className="testimonial-count">
                0{testimonialIndex + 1} <span>/ 0{activeTestimonials.length}</span>
              </span>
              <button
                className="icon-button"
                onClick={() =>
                  setTestimonialIndex(
                    (testimonialIndex + activeTestimonials.length - 1) %
                      activeTestimonials.length,
                  )
                }
                aria-label={t.previousReview}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                className="icon-button"
                onClick={() =>
                  setTestimonialIndex(
                    (testimonialIndex + 1) % activeTestimonials.length,
                  )
                }
                aria-label={t.nextReview}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="testimonial-orbit" aria-hidden="true">
            ✳
          </div>
        </section>

        <section className="faq-section section-wrap" id="faq">
          <div className="faq-title">
            <span className="eyebrow">
              <span className="section-index">06</span> {t.faqEyebrow}
            </span>
            <h2>
              {t.faqStart}
              <br />
              {t.faqEnd} <em>{t.faqEmphasis}</em>
            </h2>
            <p>
              {t.faqIntro}
            </p>
            <a
              className="text-link"
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              {t.askWhatsApp} <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="faq-list">
            {t.faq.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>
                  <span>{question}</span>
                  <Plus size={19} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="newsletter-section">
          <div>
            <span className="eyebrow light-eyebrow">
              {t.newsletterEyebrow}
            </span>
            <h2>
              {t.newsletterStart} <em>{t.newsletterEmphasis}</em> {t.newsletterEnd}
            </h2>
            <p>
              {t.newsletterCopy}
            </p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              const email = new FormData(event.currentTarget).get("email");
              const emailBody = locale === "en" ? `Please subscribe this email address: ${email}` : `Mohon daftarkan alamat email ini: ${email}`;
              window.location.href = `mailto:${config?.contact?.email ?? "info@zikharoastery.com"}?subject=${encodeURIComponent(t.newsletterSubject)}&body=${encodeURIComponent(emailBody)}`;
            }}
          >
            <label htmlFor="newsletter-email">{t.emailLabel}</label>
            <div>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="name@email.com"
              />
              <button type="submit" aria-label={t.subscribe}>
                <ArrowRight size={19} />
              </button>
            </div>
            <small>
              {t.newsletterConsent}
            </small>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#beranda" className="brand">
              <span className="brand-mark">
                <Coffee size={20} />
              </span>
              <span>
                ZIKHA<span className="brand-light">ROASTERY</span>
              </span>
            </a>
            <p>
              Growing goodness
              <br />
              through coffee.
            </p>
            <a
              className="social-link"
              href="https://instagram.com/zikharoastery"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram ZIKHA ROASTERY"
            >
              <Instagram size={18} />
            </a>
          </div>
          <div className="footer-column">
            <span className="eyebrow">{t.footerExplore}</span>
            <a href="#katalog">{t.footerCatalog}</a>
            <a href="#roasting">{t.navRoasting}</a>
            <a href="#jurnal">{t.footerJournal}</a>
            <a href="#cerita">{t.navStory}</a>
          </div>
          <div className="footer-column">
            <span className="eyebrow">{t.footerVisit}</span>
            <p>{config?.contact?.address ?? "Jakarta, Indonesia"}</p>
            <p>
              {t.weekdays} ·{" "}
              {config?.operationalHours?.weekdays ?? "08:00 - 17:00"}
            </p>
            <p>
              {t.saturday} · {config?.operationalHours?.saturday ?? "08:00 - 15:00"}
            </p>
          </div>
          <div className="footer-column">
            <span className="eyebrow">{t.footerContact}</span>
            <a href={`mailto:${config?.contact?.email}`}>
              {config?.contact?.email ?? "info@zikharoastery.com"}
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              {t.contactWhatsApp} <ArrowUpRight size={14} />
            </a>
            <span className="shipping-note">
              <Leaf size={14} /> {t.shippingNationwide}
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.copyright}</span>
          <span>
            GROWING GOODNESS THROUGH COFFEE <Heart size={12} />
          </span>
          <a href="#beranda">
            {t.backToTop} <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            <motion.section
              className="product-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-modal-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <button
                className="modal-close icon-button"
                onClick={() => setSelected(null)}
                aria-label={t.closeProduct}
              >
                <X size={20} />
              </button>
              <div className="modal-gallery">
                <div
                  className="modal-image"
                >
                  <LazyImage src={detailImage} alt={`${selected.name} coffee`} />
                  <span className="roast-badge">
                      {labelRoast(selected.roastLevel)} {t.roastSuffix}
                  </span>
                </div>
                <div className="gallery-thumbnails">
                  {[selected.image, ...detailImages].map((image, index) => (
                    <button
                      key={image}
                      onClick={() => setDetailImage(image)}
                      className={
                        detailImage === image
                          ? "gallery-thumbnail active"
                          : "gallery-thumbnail"
                      }
                      aria-label={`Tampilkan foto ${index + 1}`}
                      aria-pressed={detailImage === image}
                    >
                      <LazyImage src={image} alt="" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-copy">
                <span className="eyebrow">
                  {selected.origin} · {labelBean(selected.beanType)}
                </span>
                <h2 id="product-modal-title">{selected.name}</h2>
                <p>{locale === "en" ? selected.english?.description ?? selected.description : selected.description}</p>
                <div className="detail-specs">
                  <div>
                    <span>{t.origin}</span>
                    <b>{selected.origin}</b>
                  </div>
                  <div>
                    <span>{t.process}</span>
                    <b>{selected.process}</b>
                  </div>
                  <div>
                    <span>{t.roastLevel}</span>
                    <b>{selected.roastLevel}</b>
                  </div>
                  <div>
                    <span>{t.weight}</span>
                    <b>{selected.weight}</b>
                  </div>
                </div>
                <div className="modal-notes">
                  <span>{t.tastingNotes}</span>
                  <div>
                    {selected.tastingNotes.map((note) => (
                      <i key={note}>{note}</i>
                    ))}
                  </div>
                </div>
                <div className="modal-action">
                  <div>
                    <strong>{money(selected.price, locale)}</strong>
                    <small> / {selected.weight}</small>
                  </div>
                  <button
                    className="button button-dark"
                    onClick={() => {
                      addToCart(selected);
                      setSelected(null);
                      setCartOpen(true);
                    }}
                  >
                    <ShoppingBag size={16} /> {t.addProduct}
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setSelectedArticle(null);
            }}
          >
            <motion.article
              className="article-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <button
                className="modal-close icon-button"
                onClick={() => setSelectedArticle(null)}
                aria-label={t.closeArticle}
              >
                <X size={20} />
              </button>
              <div
                className="article-modal-image"
              >
                <LazyImage
                  src={selectedArticle.image}
                  alt={locale === "en" ? selectedArticle.english?.title ?? selectedArticle.title : selectedArticle.title}
                />
              </div>
              {selectedArticleVideo && (
                <div className="article-video">
                  <iframe
                    src={selectedArticleVideo}
                    title={t.youtubeFrameTitle}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="article-modal-copy">
                <div className="journal-meta">
                  <span>{locale === "en" ? selectedArticle.english?.category ?? selectedArticle.category : selectedArticle.category}</span>
                  <span>{locale === "en" ? selectedArticle.english?.date ?? selectedArticle.date : selectedArticle.date}</span>
                </div>
                <h2 id="article-title">{locale === "en" ? selectedArticle.english?.title ?? selectedArticle.title : selectedArticle.title}</h2>
                {(locale === "en" ? selectedArticle.english?.body ?? selectedArticle.body : selectedArticle.body).split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <button
                  className="text-link"
                  onClick={() => setSelectedArticle(null)}
                >
                  {t.backToJournal} <ArrowLeft size={15} />
                </button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="overlay drawer-overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setCartOpen(false);
            }}
          >
            <motion.aside
              className="cart-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="drawer-header">
                <div>
                  <span className="eyebrow">{t.cart}</span>
                  <h2 id="cart-title">
                    {t.cart} <span>({cartCount})</span>
                  </h2>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setCartOpen(false)}
                  aria-label={t.closeCart}
                >
                  <X size={20} />
                </button>
              </div>
              {cartProducts.length ? (
                <>
                  <div className="cart-lines">
                    {cartProducts.map(({ product, quantity }) => (
                      <div className="cart-line" key={product.id}>
                        <div
                          className="cart-thumb"
                        >
                          <LazyImage src={product.image} alt="" />
                        </div>
                        <div className="cart-line-info">
                          <span>
                            {product.origin} · {labelRoast(product.roastLevel)}
                          </span>
                          <h3>{product.name}</h3>
                          <b>{money(product.price, locale)}</b>
                          <div className="quantity-control">
                            <button
                              onClick={() => changeQuantity(product.id, -1)}
                              aria-label={`${t.decreaseQuantity} ${product.name}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={() => changeQuantity(product.id, 1)}
                              aria-label={`${t.increaseQuantity} ${product.name}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="remove-line"
                          onClick={() =>
                            setCart((current) =>
                              current.filter((line) => line.id !== product.id),
                            )
                          }
                          aria-label={`${t.removeProduct} ${product.name}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-summary">
                    <p>
                      <span>{t.subtotal}</span>
                      <strong>{money(cartTotal, locale)}</strong>
                    </p>
                    <small>
                      {t.shippingNote}
                    </small>
                    <a
                      className="button button-dark checkout-button"
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(checkoutMessage)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setCartOpen(false)}
                    >
                      {t.checkout} <ArrowUpRight size={17} />
                    </a>
                    <button
                      className="continue-shopping"
                      onClick={() => setCartOpen(false)}
                    >
                      <ArrowLeft size={15} /> {t.continueShopping}
                    </button>
                  </div>
                </>
              ) : (
                <div className="cart-empty">
                  <span>
                    <ShoppingBag size={25} />
                  </span>
                  <h3>{t.emptyCart}</h3>
                  <p>{t.emptyCartCopy}</p>
                  <button
                    className="button button-dark"
                    onClick={() => {
                      setCartOpen(false);
                      jumpToCatalog();
                    }}
                  >
                    {t.viewCatalog} <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            className="compare-dock"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            <div className="compare-dock-label">
              <span className="compare-count">{compareIds.length}</span>
              <span>
                {t.selectedForCompare}
                <br />
                <b>{t.comparePurpose}</b>
              </span>
            </div>
            <div className="compare-dock-names">
              {comparedProducts.map((product) => (
                <span key={product.id}>
                  {product.name}
                  <button
                    onClick={() => toggleCompare(product)}
                    aria-label={`${t.removeCompare} ${product.name}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <button
              className="compare-open"
              onClick={() => setCompareOpen(true)}
              disabled={compareIds.length < 2}
            >
              {t.compare} <ArrowRight size={16} />
            </button>
            <button
              className="compare-clear"
              onClick={() => setCompareIds([])}
              aria-label={t.clearCompare}
            >
              <X size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compareOpen && (
          <motion.div
            className="overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setCompareOpen(false);
            }}
          >
            <motion.section
              className="comparison-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="comparison-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <div className="compare-header">
                <div>
                  <span className="eyebrow">{t.compareEyebrow}</span>
                  <h2 id="comparison-title">
                    {t.compareTitle} <em>{t.compareEmphasis}</em>
                  </h2>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setCompareOpen(false)}
                  aria-label={t.closeCompare}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="comparison-table">
                <div className="compare-labels">
                  <span>{t.profile}</span>
                  <span>{t.beanType}</span>
                  <span>{t.originLabel}</span>
                  <span>{t.roastLabel}</span>
                  <span>{t.processLabel}</span>
                  <span>{t.tasteLabel}</span>
                  <span>{t.price250}</span>
                </div>
                {comparedProducts.map((product) => (
                  <div className="compare-column" key={product.id}>
                    <div
                      className="compare-product-image"
                    >
                      <LazyImage src={product.image} alt="" />
                    </div>
                    <h3>{product.name}</h3>
                    <span>{labelBean(product.beanType)}</span>
                    <span>{product.origin}</span>
                    <span>{labelRoast(product.roastLevel)}</span>
                    <span>{product.process}</span>
                    <span className="compare-tastes">
                      {product.tastingNotes.join(" · ")}
                    </span>
                    <b>{money(product.price, locale)}</b>
                    <button
                      onClick={() => {
                        addToCart(product);
                        setCompareOpen(false);
                        setCartOpen(true);
                      }}
                    >
                      <Plus size={15} /> {t.addProduct}
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
