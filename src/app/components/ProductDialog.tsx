'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { getBeanLabel, getRoastLabel, formatCurrency } from '@/lib/presentation';
import { translations, type Locale } from '@/lib/translations';
import LazyImage from './LazyImage';

type Props = {
  product: Product | null;
  locale: Locale;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
};

const detailImages = [
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85',
];

export default function ProductDialog({ product, locale, onClose, onAddToCart }: Props) {
  const t = translations[locale];
  const [gallery, setGallery] = useState<{ productId: string; image: string } | null>(null);
  const activeImage = product
    ? gallery?.productId === product.id
      ? gallery.image
      : product.image
    : undefined;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="overlay"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
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
            <button className="modal-close icon-button" onClick={onClose} aria-label={t.closeProduct}>
              <X size={20} />
            </button>
            <div className="modal-gallery">
              <div className="modal-image">
                {activeImage && <LazyImage key={activeImage} src={activeImage} alt={`${product.name} coffee`} />}
                <span className="roast-badge">{getRoastLabel(product.roastLevel, locale)} {t.roastSuffix}</span>
              </div>
              <div className="gallery-thumbnails">
                {[product.image, ...detailImages].map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setGallery({ productId: product.id, image })}
                    className={activeImage === image ? 'gallery-thumbnail active' : 'gallery-thumbnail'}
                    aria-label={`${t.galleryPhoto} ${index + 1}`}
                    aria-pressed={activeImage === image}
                  >
                    <LazyImage src={image} alt="" />
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-copy">
              <span className="eyebrow">{product.origin} · {getBeanLabel(product.beanType, locale)}</span>
              <h2 id="product-modal-title">{product.name}</h2>
              <p>{locale === 'en' ? product.english?.description ?? product.description : product.description}</p>
              <div className="detail-specs">
                <div><span>{t.origin}</span><b>{product.origin}</b></div>
                <div><span>{t.process}</span><b>{product.process}</b></div>
                <div><span>{t.roastLevel}</span><b>{getRoastLabel(product.roastLevel, locale)}</b></div>
                <div><span>{t.weight}</span><b>{product.weight}</b></div>
              </div>
              <div className="modal-notes">
                <span>{t.tastingNotes}</span>
                <div>{product.tastingNotes.map((note) => <i key={note}>{note}</i>)}</div>
              </div>
              <div className="modal-action">
                <div><strong>{formatCurrency(product.price, locale)}</strong><small> / {product.weight}</small></div>
                <button className="button button-dark" onClick={() => onAddToCart(product)}>
                  <ShoppingBag size={16} /> {t.addProduct}
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}