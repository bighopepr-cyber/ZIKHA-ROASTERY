"use client";

import { useState } from "react";

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function LazyImage({ src, alt, className = "" }: LazyImageProps) {
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