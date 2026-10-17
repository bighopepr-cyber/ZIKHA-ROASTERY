'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Coffee, Flame, Heart, Instagram, Leaf, Minus, Moon, Plus, Search, ShoppingBag, SlidersHorizontal, Sun, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Article, Product, Service } from '@/lib/types';

type Props = { products: Product[]; services: Service[]; articles: Article[]; config: Record<string, any>; about: Record<string, any> };
type CartLine = { id: string; quantity: number };
const money = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;
const heroImage = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=90';
const detailImages = [
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85',
];
const faqs = [
  ['Apakah kopi di-roasting setelah dipesan?', 'Ya. Kami menyangrai dalam batch kecil dan mengirimkan kopi dalam kondisi segar. Kami menyarankan kopi beristirahat 5-10 hari setelah tanggal roasting sebelum diseduh.'],
  ['Apakah tersedia jasa roasting untuk biji milik sendiri?', 'Tersedia mulai dari 1 kg. Pilih profil light, medium, atau dark, lalu hubungi kami untuk mendiskusikan karakter biji dan hasil yang diinginkan.'],
  ['Bagaimana cara menjaga kesegaran kopi?', 'Simpan kopi dalam kemasan tertutup, di tempat sejuk dan kering, jauh dari cahaya matahari. Hindari menyimpan kopi di kulkas karena kelembapan dapat memengaruhi rasanya.'],
  ['Berapa lama pengiriman dan ke mana saja?', 'Kami melayani pengiriman ke seluruh Indonesia. Estimasi tiba 2-5 hari kerja, bergantung pada lokasi dan layanan kurir yang dipilih.'],
];
const testimonials = [
  { quote: 'Akhirnya nemu kopi lokal yang konsisten. Arabica Medium-nya punya manis karamel yang enak banget, bahkan diseduh simpel pakai V60.', name: 'Rani A.', since: 'Pelanggan sejak 2023', product: 'ARABICA MEDIUM · JAKARTA', initials: 'RA' },
  { quote: 'Jasa roasting-nya komunikatif dan hasilnya pas dengan karakter biji yang saya cari. Profil Light Roast-nya bikin rasa buahnya keluar tanpa terasa tipis.', name: 'Dimas P.', since: 'Roasting partner · Bandung', product: 'JASA LIGHT ROAST · BANDUNG', initials: 'DP' },
  { quote: 'Robusta Lampung-nya bold tapi tetap bersih. Cocok untuk espresso pagi, dan dikirim segar dengan catatan seduh yang membantu.', name: 'Maya S.', since: 'Pelanggan sejak 2024', product: 'ROBUSTA DARK · YOGYAKARTA', initials: 'MS' },
];

export default function Storefront({ products, services, articles, config, about }: Props) {
  const [query, setQuery] = useState('');
  const [roast, setRoast] = useState('Semua roast');
  const [bean, setBean] = useState('Semua jenis');
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<(typeof articles)[number] | null>(null);
  const [detailImage, setDetailImage] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileNav, setMobileNav] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('zikha-cart');
      const storedTheme = localStorage.getItem('zikha-theme');
      if (storedCart) setCart(JSON.parse(storedCart) as CartLine[]);
      if (storedTheme === 'dark' || storedTheme === 'light') setTheme(storedTheme);
    } catch {
      localStorage.removeItem('zikha-cart');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('zikha-cart', JSON.stringify(cart));
    localStorage.setItem('zikha-theme', theme);
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  }, [cart, theme, hydrated]);

  useEffect(() => {
    if (!selected && !selectedArticle && !cartOpen && !compareOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setSelected(null); setSelectedArticle(null); setCartOpen(false); setCompareOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, selectedArticle, cartOpen, compareOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
        && !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.search-field input')?.focus();
        document.querySelector('#katalog')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (selected) setDetailImage(selected.image);
  }, [selected]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const needle = query.trim().toLowerCase();
    const matchesText = !needle || [product.name, product.origin, product.beanType, product.roastLevel, ...product.tastingNotes].some((value) => value.toLowerCase().includes(needle));
    return matchesText && (roast === 'Semua roast' || product.roastLevel === roast) && (bean === 'Semua jenis' || product.beanType === bean);
  }), [products, query, roast, bean]);

  const cartProducts = cart.map((line) => ({ ...line, product: products.find((item) => item.id === line.id) })).filter((line): line is CartLine & { product: Product } => Boolean(line.product));
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartProducts.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const comparedProducts = compareIds.map((id) => products.find((product) => product.id === id)).filter((item): item is Product => Boolean(item));
  const whatsapp = config?.contact?.whatsapp ?? '6281234567890';
  const checkoutMessage = `Halo ZIKHA ROASTERY, saya ingin memesan:\n${cartProducts.map(({ product, quantity }) => `- ${product.name} (${product.weight}) x${quantity}`).join('\n')}\n\nTotal produk: ${money(cartTotal)}\nMohon info ongkir dan cara pembayarannya.`;

  function addToCart(product: Product) {
    setCart((current) => current.some((line) => line.id === product.id)
      ? current.map((line) => line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { id: product.id, quantity: 1 }]);
  }
  function changeQuantity(id: string, amount: number) {
    setCart((current) => current.map((line) => line.id === id ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0));
  }
  function toggleCompare(product: Product) {
    setCompareIds((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : current.length < 3 ? [...current, product.id] : current);
  }
  function jumpToCatalog() {
    document.querySelector('#katalog')?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  }

  return <div className="site-shell">
    <div className="announcement"><span>DISANGRAI SEGAR, DIKIRIM SEPENUH HATI</span><span>Pengiriman seluruh Indonesia · 2-5 hari kerja</span></div>
    <header className="site-header">
      <a href="#beranda" className="brand" aria-label="ZIKHA ROASTERY, beranda"><span className="brand-mark"><Coffee size={20} strokeWidth={1.7} /></span><span>ZIKHA<span className="brand-light">ROASTERY</span></span></a>
      <nav className={mobileNav ? 'main-nav nav-open' : 'main-nav'} aria-label="Navigasi utama"><a href="#cerita" onClick={() => setMobileNav(false)}>Cerita kami</a><a href="#katalog" onClick={() => setMobileNav(false)}>Kopi</a><a href="#roasting" onClick={() => setMobileNav(false)}>Jasa roasting</a><a href="#jurnal" onClick={() => setMobileNav(false)}>Jurnal</a></nav>
      <div className="header-actions"><button className="icon-button theme-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={theme === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang'} title={theme === 'light' ? 'Tema gelap' : 'Tema terang'}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Buka keranjang, ${cartCount} item`}><ShoppingBag size={18} /><span>Keranjang</span><b>{cartCount}</b></button><button className="menu-toggle icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label={mobileNav ? 'Tutup navigasi' : 'Buka navigasi'}>{mobileNav ? <X size={20} /> : <span className="menu-lines" />}</button></div>
    </header>

    <main>
      <section className="hero" id="beranda" style={{ backgroundImage: `linear-gradient(90deg, rgba(23,35,27,.85) 0%, rgba(23,35,27,.56) 43%, rgba(23,35,27,.08) 100%), url("${heroImage}")` }}>
        <div className="hero-content"><p className="eyebrow light-eyebrow"><span /> KOPI YANG PUNYA ASAL</p><h1>Tumbuh baik.<br /><em>Diseduh</em> sepenuh hati.</h1><p className="hero-copy">Biji pilihan dari petani lokal, disangrai segar dalam batch kecil. Setiap cangkir membawa cerita yang layak dibagikan.</p><div className="hero-actions"><button className="button button-lime" onClick={jumpToCatalog}>Jelajahi kopi <ArrowRight size={17} /></button><a href="#cerita" className="text-link light-link">Kenali cerita kami <ArrowDown size={15} /></a></div></div>
        <div className="hero-side-note"><span>01 / 03</span><span>ASAL. PROSES. RASA.</span><span>JAWA TENGAH · INDONESIA</span></div><div className="hero-stamp"><span>GOOD<br />GROUNDS</span><Leaf size={20} /></div>
      </section>

      <section className="ticker" aria-label="Nilai ZIKHA ROASTERY"><div className="ticker-track"><span>TRACEABLE ORIGIN</span><i>✳</i><span>ROASTED WITH CARE</span><i>✳</i><span>GROWING GOODNESS</span><i>✳</i><span>TRACEABLE ORIGIN</span><i>✳</i><span>ROASTED WITH CARE</span><i>✳</i><span>GROWING GOODNESS</span><i>✳</i></div></section>

      <section className="intro-section section-wrap" id="cerita"><div className="intro-label"><span className="section-index">01</span><span className="eyebrow">ASAL YANG BAIK, RASA YANG JUJUR</span></div><div className="intro-main"><h2>Kopi bukan cuma<br />soal <em>rasa.</em></h2><div className="intro-copy"><p>{about?.story ?? 'Kami percaya kopi yang baik dimulai dari biji yang dipilih dengan teliti, hubungan yang adil dengan petani, dan proses roasting yang penuh perhatian.'}</p><a className="text-link" href="#roasting">Lebih jauh tentang kami <ArrowUpRight size={16} /></a></div></div><div className="values-row">{(about?.values ?? []).map((value: { title: string; description: string }, index: number) => <div className="value-item" key={value.title}><span>0{index + 1}</span><h3>{value.title}</h3><p>{value.description}</p></div>)}</div></section>

      <section className="catalog-section" id="katalog"><div className="section-wrap"><div className="section-heading catalog-heading"><div><span className="eyebrow"><span className="section-index">02</span> PILIHAN DARI ROASTER</span><h2>Temukan <em>seduhanmu.</em></h2></div><p>Setiap origin punya karakternya sendiri. Mulai dari yang ringan dan cerah, sampai yang berani dan penuh.</p></div>
        <div className="catalog-toolbar"><label className="search-field"><Search size={17} /><input aria-label="Cari nama, origin, atau rasa kopi" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kopi atau tasting notes..." /><kbd>/</kbd></label><label className="select-field"><SlidersHorizontal size={16} /><select aria-label="Filter tingkat roast" value={roast} onChange={(event) => setRoast(event.target.value)}>{['Semua roast', 'Light', 'Medium', 'Dark'].map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label><label className="select-field bean-select"><select aria-label="Filter jenis biji" value={bean} onChange={(event) => setBean(event.target.value)}>{['Semua jenis', 'Arabica', 'Robusta', 'Blend'].map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label></div>
        <div className="catalog-meta"><span>{filteredProducts.length} kopi pilihan</span><span>Semua harga untuk kemasan 250g</span></div>
        {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => { const isCompared = compareIds.includes(product.id); return <motion.article className="product-card" key={product.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .42, delay: (index % 3) * .08 }}>
          <button className="product-image" onClick={() => setSelected(product)} aria-label={`Lihat detail ${product.name}`} style={{ backgroundImage: `url("${product.image}")` }}><span className="roast-badge">{product.roastLevel} roast</span><span className="image-arrow"><ArrowUpRight size={19} /></span></button>
          <div className="product-info"><div className="product-title-row"><div><span className="product-origin">{product.origin} · {product.beanType}</span><h3><button onClick={() => setSelected(product)}>{product.name}</button></h3></div><button className={isCompared ? 'compare-check selected' : 'compare-check'} onClick={() => toggleCompare(product)} aria-label={isCompared ? `Hapus ${product.name} dari perbandingan` : `Bandingkan ${product.name}`} title={compareIds.length >= 3 && !isCompared ? 'Maksimal 3 kopi untuk dibandingkan' : 'Bandingkan kopi'} disabled={compareIds.length >= 3 && !isCompared}>{isCompared ? <Check size={16} /> : <Plus size={16} />}</button></div><div className="tasting-notes">{product.tastingNotes.map((note) => <span key={note}>{note}</span>)}</div><div className="product-bottom"><strong>{money(product.price)}</strong><span>/{product.weight}</span><button className="add-button" onClick={() => { addToCart(product); setCartOpen(true); }} aria-label={`Tambah ${product.name} ke keranjang`}><Plus size={19} /></button></div></div>
        </motion.article>; })}</div> : <div className="empty-results"><Coffee size={27} /><p>Belum ada kopi yang cocok dengan pencarian ini.</p><button className="text-link" onClick={() => { setQuery(''); setRoast('Semua roast'); setBean('Semua jenis'); }}>Hapus semua filter <ArrowRight size={15} /></button></div>}
        <div className="catalog-footnote"><span><Leaf size={15} /> Disangrai dalam batch kecil. Selalu segar.</span><button className="text-link" onClick={() => { setQuery(''); setRoast('Semua roast'); setBean('Semua jenis'); }}>Lihat semua kopi <ArrowRight size={15} /></button></div>
      </div></section>

      <section className="roasting-section" id="roasting"><div className="roasting-photo" role="img" aria-label="Biji kopi sedang disiapkan untuk proses roasting" /><div className="roasting-content"><span className="eyebrow light-eyebrow"><span className="section-index">03</span> UNTUK KOPIMU SENDIRI</span><h2>Biji pilihanmu.<br /><em>Sentuhan</em> kami.</h2><p>Punya green bean sendiri? Kami bantu menemukan profil sangrai yang paling pas, dari first crack sampai karakter rasa yang kamu cari.</p><div className="service-list">{services.map((service) => <div className="service-row" key={service.id}><div className="service-icon">{service.icon === 'sun' ? <Sun size={19} /> : service.icon === 'flame' ? <Flame size={19} /> : <Coffee size={19} />}</div><div className="service-description"><h3>{service.name}{service.popular && <span>PALING DIPILIH</span>}</h3><p>{service.description}</p><div>{service.features.map((feature) => <i key={feature}>{feature}</i>)}</div></div><strong>{money(service.price)}<small> / {service.unit}</small></strong></div>)}</div><a className="button button-lime" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Halo ZIKHA ROASTERY, saya ingin konsultasi jasa roasting.')}`} target="_blank" rel="noreferrer">Diskusikan kebutuhanmu <ArrowUpRight size={17} /></a></div></section>

      <section className="quote-section"><div className="quote-mark">“</div><blockquote>Rasa yang baik berawal dari hubungan yang baik.</blockquote><div className="quote-attribution"><span className="quote-rule" /> ZIKHA ROASTERY · BERDIRI BERSAMA PETANI LOKAL</div><div className="quote-orbit" aria-hidden="true">Z</div></section>

      <section className="journal-section section-wrap" id="jurnal"><div className="section-heading"><div><span className="eyebrow"><span className="section-index">04</span> CATATAN DARI ROASTERY</span><h2>Jurnal <em>seduhan.</em></h2></div><button className="text-link" onClick={() => setSelectedArticle(articles[0])}>Baca semua cerita <ArrowRight size={16} /></button></div><div className="journal-grid">{articles.map((article, index) => <article className="journal-card" key={article.title}><button type="button" className="journal-image" onClick={() => setSelectedArticle(article)} style={{ backgroundImage: `url("${article.image}")` }} aria-label={`Baca: ${article.title}`}><span>0{index + 1}</span><ArrowUpRight size={18} /></button><div className="journal-meta"><span>{article.category}</span><span>{article.date}</span></div><h3><button className="journal-link" onClick={() => setSelectedArticle(article)}>{article.title}</button></h3></article>)}</div></section>

      <section className="testimonial-section" aria-roledescription="carousel" aria-label="Ulasan pelanggan"><div className="testimonial-top"><span className="eyebrow"><span className="section-index">05</span> KATA MEREKA</span><div className="rating"><span>★★★★★</span> 4.9 / 5 · DARI PENCINTA KOPI</div></div><div className="testimonial-body" aria-live="polite"><blockquote>“{testimonials[testimonialIndex].quote}”</blockquote><div className="reviewer"><span className="reviewer-avatar">{testimonials[testimonialIndex].initials}</span><span><b>{testimonials[testimonialIndex].name}</b><small>{testimonials[testimonialIndex].since}</small></span><span className="reviewer-product">{testimonials[testimonialIndex].product}</span></div><div className="testimonial-controls"><span className="testimonial-count">0{testimonialIndex + 1} <span>/ 0{testimonials.length}</span></span><button className="icon-button" onClick={() => setTestimonialIndex((testimonialIndex + testimonials.length - 1) % testimonials.length)} aria-label="Ulasan sebelumnya"><ArrowLeft size={16} /></button><button className="icon-button" onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)} aria-label="Ulasan berikutnya"><ArrowRight size={16} /></button></div></div><div className="testimonial-orbit" aria-hidden="true">✳</div></section>

      <section className="faq-section section-wrap" id="faq"><div className="faq-title"><span className="eyebrow"><span className="section-index">06</span> ADA YANG INGIN DITANYAKAN?</span><h2>Hal baik dimulai<br />dari <em>pertanyaan.</em></h2><p>Belum menemukan jawabanmu? Ceritakan kebutuhanmu, kami senang membantu.</p><a className="text-link" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Tanya langsung via WhatsApp <ArrowUpRight size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><Plus size={19} /></summary><p>{answer}</p></details>)}</div></section>

      <section className="newsletter-section"><div><span className="eyebrow light-eyebrow">SURAT KECIL DARI ROASTERY</span><h2>Kabar baik, <em>diseduh</em> berkala.</h2><p>Cerita kebun, panduan seduh, dan kabar batch terbaru. Tanpa spam, janji.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); const email = new FormData(event.currentTarget).get('email'); window.location.href = `mailto:${config?.contact?.email ?? 'info@zikharoastery.com'}?subject=Daftar%20surat%20ZIKHA%20ROASTERY&body=${encodeURIComponent(`Mohon daftarkan alamat email ini: ${email}`)}`; }}><label htmlFor="newsletter-email">Alamat email</label><div><input id="newsletter-email" name="email" type="email" required placeholder="nama@email.com" /><button type="submit" aria-label="Daftar newsletter"><ArrowRight size={19} /></button></div><small>Dengan mendaftar, kamu setuju menerima kabar dari kami.</small></form></section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a href="#beranda" className="brand"><span className="brand-mark"><Coffee size={20} /></span><span>ZIKHA<span className="brand-light">ROASTERY</span></span></a><p>Growing goodness<br />through coffee.</p><a className="social-link" href="https://instagram.com/zikharoastery" target="_blank" rel="noreferrer" aria-label="Instagram ZIKHA ROASTERY"><Instagram size={18} /></a></div><div className="footer-column"><span className="eyebrow">JELAJAHI</span><a href="#katalog">Katalog kopi</a><a href="#roasting">Jasa roasting</a><a href="#jurnal">Jurnal seduhan</a><a href="#cerita">Cerita kami</a></div><div className="footer-column"><span className="eyebrow">KUNJUNGI KAMI</span><p>{config?.contact?.address ?? 'Jakarta, Indonesia'}</p><p>Senin-Jumat · {config?.operationalHours?.weekdays ?? '08:00 - 17:00'}</p><p>Sabtu · {config?.operationalHours?.saturday ?? '08:00 - 15:00'}</p></div><div className="footer-column"><span className="eyebrow">SAPA KAMI</span><a href={`mailto:${config?.contact?.email}`}>{config?.contact?.email ?? 'info@zikharoastery.com'}</a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp kami <ArrowUpRight size={14} /></a><span className="shipping-note"><Leaf size={14} /> Kirim ke seluruh Indonesia</span></div></div><div className="footer-bottom"><span>© 2025 ZIKHA ROASTERY. DIBUAT DENGAN SEPENUH HATI.</span><span>GROWING GOODNESS THROUGH COFFEE <Heart size={12} /></span><a href="#beranda">KEMBALI KE ATAS <ArrowUpRight size={14} /></a></div></footer>

    <AnimatePresence>{selected && <motion.div className="overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><motion.section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><button className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="Tutup detail produk"><X size={20} /></button><div className="modal-gallery"><div className="modal-image" style={{ backgroundImage: `url("${detailImage}")` }}><span className="roast-badge">{selected.roastLevel} roast</span></div><div className="gallery-thumbnails">{[selected.image, ...detailImages].map((image, index) => <button key={image} onClick={() => setDetailImage(image)} className={detailImage === image ? 'gallery-thumbnail active' : 'gallery-thumbnail'} aria-label={`Tampilkan foto ${index + 1}`} aria-pressed={detailImage === image} style={{ backgroundImage: `url("${image}")` }} />)}</div></div><div className="modal-copy"><span className="eyebrow">{selected.origin} · {selected.beanType}</span><h2 id="product-modal-title">{selected.name}</h2><p>{selected.description}</p><div className="detail-specs"><div><span>ASAL</span><b>{selected.origin}</b></div><div><span>PROSES</span><b>{selected.process}</b></div><div><span>ROAST LEVEL</span><b>{selected.roastLevel}</b></div><div><span>BERAT</span><b>{selected.weight}</b></div></div><div className="modal-notes"><span>TASTING NOTES</span><div>{selected.tastingNotes.map((note) => <i key={note}>{note}</i>)}</div></div><div className="modal-action"><div><strong>{money(selected.price)}</strong><small> / {selected.weight}</small></div><button className="button button-dark" onClick={() => { addToCart(selected); setSelected(null); setCartOpen(true); }}><ShoppingBag size={16} /> Tambah ke keranjang</button></div></div></motion.section></motion.div>}</AnimatePresence>

    <AnimatePresence>{selectedArticle && <motion.div className="overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedArticle(null); }}><motion.article className="article-modal" role="dialog" aria-modal="true" aria-labelledby="article-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><button className="modal-close icon-button" onClick={() => setSelectedArticle(null)} aria-label="Tutup artikel"><X size={20} /></button><div className="article-modal-image" style={{ backgroundImage: `url("${selectedArticle.image}")` }} /><div className="article-modal-copy"><div className="journal-meta"><span>{selectedArticle.category}</span><span>{selectedArticle.date}</span></div><h2 id="article-title">{selectedArticle.title}</h2>{selectedArticle.body.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<button className="text-link" onClick={() => setSelectedArticle(null)}>Kembali ke jurnal <ArrowLeft size={15} /></button></div></motion.article></motion.div>}</AnimatePresence>

    <AnimatePresence>{cartOpen && <motion.div className="overlay drawer-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: .25 }}><div className="drawer-header"><div><span className="eyebrow">PILIHANMU</span><h2 id="cart-title">Keranjang <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Tutup keranjang"><X size={20} /></button></div>{cartProducts.length ? <><div className="cart-lines">{cartProducts.map(({ product, quantity }) => <div className="cart-line" key={product.id}><div className="cart-thumb" style={{ backgroundImage: `url("${product.image}")` }} /><div className="cart-line-info"><span>{product.origin} · {product.roastLevel}</span><h3>{product.name}</h3><b>{money(product.price)}</b><div className="quantity-control"><button onClick={() => changeQuantity(product.id, -1)} aria-label={`Kurangi jumlah ${product.name}`}><Minus size={13} /></button><span>{quantity}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label={`Tambah jumlah ${product.name}`}><Plus size={13} /></button></div></div><button className="remove-line" onClick={() => setCart((current) => current.filter((line) => line.id !== product.id))} aria-label={`Hapus ${product.name}`}><X size={16} /></button></div>)}</div><div className="cart-summary"><p><span>Subtotal</span><strong>{money(cartTotal)}</strong></p><small>Ongkos kirim dihitung saat konfirmasi melalui WhatsApp.</small><a className="button button-dark checkout-button" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(checkoutMessage)}`} target="_blank" rel="noreferrer" onClick={() => setCartOpen(false)}>Lanjutkan via WhatsApp <ArrowUpRight size={17} /></a><button className="continue-shopping" onClick={() => setCartOpen(false)}><ArrowLeft size={15} /> Lanjut melihat kopi</button></div></> : <div className="cart-empty"><span><ShoppingBag size={25} /></span><h3>Keranjangmu masih kosong.</h3><p>Temukan kopi yang pas untuk ritual seduh berikutnya.</p><button className="button button-dark" onClick={() => { setCartOpen(false); jumpToCatalog(); }}>Lihat katalog <ArrowRight size={16} /></button></div>}</motion.aside></motion.div>}</AnimatePresence>

    <AnimatePresence>{compareIds.length > 0 && <motion.div className="compare-dock" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}><div className="compare-dock-label"><span className="compare-count">{compareIds.length}</span><span>kopi dipilih<br /><b>untuk dibandingkan</b></span></div><div className="compare-dock-names">{comparedProducts.map((product) => <span key={product.id}>{product.name}<button onClick={() => toggleCompare(product)} aria-label={`Hapus ${product.name} dari perbandingan`}><X size={12} /></button></span>)}</div><button className="compare-open" onClick={() => setCompareOpen(true)} disabled={compareIds.length < 2}>Bandingkan <ArrowRight size={16} /></button><button className="compare-clear" onClick={() => setCompareIds([])} aria-label="Kosongkan pilihan perbandingan"><X size={17} /></button></motion.div>}</AnimatePresence>

    <AnimatePresence>{compareOpen && <motion.div className="overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setCompareOpen(false); }}><motion.section className="comparison-modal" role="dialog" aria-modal="true" aria-labelledby="comparison-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><div className="compare-header"><div><span className="eyebrow">TEMUKAN KARAKTER FAVORITMU</span><h2 id="comparison-title">Bandingkan <em>kopi.</em></h2></div><button className="icon-button" onClick={() => setCompareOpen(false)} aria-label="Tutup perbandingan"><X size={20} /></button></div><div className="comparison-table"><div className="compare-labels"><span>PROFIL</span><span>JENIS BIJI</span><span>ASAL</span><span>ROAST LEVEL</span><span>PROSES</span><span>TASTING NOTES</span><span>HARGA / 250G</span></div>{comparedProducts.map((product) => <div className="compare-column" key={product.id}><div className="compare-product-image" style={{ backgroundImage: `url("${product.image}")` }} /><h3>{product.name}</h3><span>{product.beanType}</span><span>{product.origin}</span><span>{product.roastLevel}</span><span>{product.process}</span><span className="compare-tastes">{product.tastingNotes.join(' · ')}</span><b>{money(product.price)}</b><button onClick={() => { addToCart(product); setCompareOpen(false); setCartOpen(true); }}><Plus size={15} /> Tambah</button></div>)}</div></motion.section></motion.div>}</AnimatePresence>
  </div>;
}