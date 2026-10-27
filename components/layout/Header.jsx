"use client";

import Link from "next/link";
import CreditsMeter from "@/components/layout/CreditsMeter";
import MainNav from "@/components/layout/MainNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Icon from "@/components/ui/Icon";

function PillButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-8 items-center justify-center gap-1.5 rounded-full bg-surface text-[11px] font-medium shadow-sm transition duration-150 hover:shadow-md active:scale-95 sm:h-7 sm:w-auto sm:px-3"
    >
      <Icon name={icon} className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function Header({ mode, onNavSelect, creditsUsed, busy, onGallery, onSupport }) {
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 pt-3 md:px-5 md:pt-4">
      <Link
        href="/"
        aria-label="Fomi home"
        className="flex size-9 items-center justify-center rounded-xl text-[28px] font-semibold leading-none tracking-tight transition hover:bg-panel active:scale-95"
      >
        F
      </Link>

      <div className="hidden min-w-0 flex-col items-center gap-1.5 md:flex">
        <CreditsMeter used={creditsUsed} busy={busy} />
        <MainNav variant="top" mode={mode} onSelect={onNavSelect} />
      </div>

      <div className="col-start-3 flex items-center gap-1.5 justify-self-end md:gap-2">
        <PillButton icon="gallery" label="Gallery" onClick={onGallery} />
        <PillButton icon="support" label="Support" onClick={onSupport} />
        <ThemeToggle />
        <button
          type="button"
          aria-label="Account"
          className="size-8 rounded-full bg-gradient-to-br from-accent to-[#a8658f] ring-2 ring-surface transition duration-150 hover:scale-105 active:scale-95"
        />
      </div>
    </header>
  );
}
