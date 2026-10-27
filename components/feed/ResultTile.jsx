"use client";

import { useState } from "react";
import FadeImage from "@/components/ui/FadeImage";
import Icon from "@/components/ui/Icon";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One generated image or video. Images use next/image; videos show a poster
 * and only mount the <video> (muted preview) while hovered or focused.
 */
export default function ResultTile({ result, index, total, aspectRatio, priority, onOpen }) {
  const [previewing, setPreviewing] = useState(false);
  const isVideo = result.type === "video";
  const kind = isVideo ? "video" : "image";

  const startPreview = () => {
    if (isVideo && !prefersReducedMotion()) setPreviewing(true);
  };
  const stopPreview = () => setPreviewing(false);

  return (
    <li
      className="group relative overflow-hidden rounded-xl bg-panel shadow-sm transition duration-300 hover:shadow-float"
      style={{ aspectRatio }}
      onPointerEnter={(event) => event.pointerType === "mouse" && startPreview()}
      onPointerLeave={stopPreview}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        onFocus={startPreview}
        onBlur={stopPreview}
        aria-label={`Open ${kind} ${index + 1} of ${total}`}
        className="absolute inset-0 block size-full cursor-zoom-in"
      >
        <FadeImage
          src={isVideo ? result.poster : result.src}
          alt={result.alt}
          sizes="(min-width: 1536px) 22vw, (min-width: 768px) 24vw, 46vw"
          priority={priority}
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
        />
        {isVideo && previewing && (
          <video
            src={result.src}
            poster={result.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </button>

      {isVideo && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-scrim px-2 py-1 text-[10px] font-medium text-white"
        >
          <Icon name="play" className="size-2.5" filled strokeWidth={0} />
          Video
        </span>
      )}

      <a
        href={isVideo ? result.src : result.src}
        download={`fomi-${result.id}${isVideo ? ".mp4" : ".webp"}`}
        aria-label={`Download ${kind} ${index + 1}`}
        title="Download"
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-scrim text-white opacity-0 backdrop-blur transition duration-200 hover:scale-110 focus-visible:opacity-100 group-hover:opacity-100 active:scale-90 [@media(hover:none)]:opacity-100"
      >
        <Icon name="download" className="size-4" />
      </a>
    </li>
  );
}
