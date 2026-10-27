"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * next/image that fades in once decoded, over a shimmering placeholder.
 * The parent must be `position: relative` (the image uses `fill`).
 */
export default function FadeImage({ alt, className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);

  // Server-rendered images may finish loading before hydration, so check `complete`.
  const ref = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <span aria-hidden="true" className="skeleton animate-shimmer absolute inset-0" />}
      <Image
        ref={ref}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        {...props}
      />
    </>
  );
}
