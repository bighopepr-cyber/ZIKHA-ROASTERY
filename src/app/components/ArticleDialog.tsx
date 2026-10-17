"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import type { Article } from "@/lib/types";
import { translations, type Locale } from "@/lib/translations";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import LazyImage from "./LazyImage";

type Props = {
  article: Article | null;
  locale: Locale;
  onClose: () => void;
};

export default function ArticleDialog({ article, locale, onClose }: Props) {
  const t = translations[locale];
  const videoUrl = getYouTubeEmbedUrl(article?.youtubeUrl);

  return (
    <AnimatePresence>
      {article && (
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
              onClick={onClose}
              aria-label={t.closeArticle}
            >
              <X size={20} />
            </button>
            <div className="article-modal-image">
              <LazyImage
                src={article.image}
                alt={
                  locale === "en"
                    ? (article.english?.title ?? article.title)
                    : article.title
                }
              />
            </div>
            {videoUrl && (
              <div className="article-video">
                <iframe
                  src={videoUrl}
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
                <span>
                  {locale === "en"
                    ? (article.english?.category ?? article.category)
                    : article.category}
                </span>
                <span>
                  {locale === "en"
                    ? (article.english?.date ?? article.date)
                    : article.date}
                </span>
              </div>
              <h2 id="article-title">
                {locale === "en"
                  ? (article.english?.title ?? article.title)
                  : article.title}
              </h2>
              {(locale === "en"
                ? (article.english?.body ?? article.body)
                : article.body
              )
                .split("\n\n")
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              <button className="text-link" onClick={onClose}>
                {t.backToJournal} <ArrowLeft size={15} />
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}