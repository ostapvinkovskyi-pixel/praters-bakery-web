"use client";
import { useEffect, useRef } from "react";

import { BrandLockup } from "./brand-mark";
import "./bakery.css";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let solid = false;
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 3.6;
      if (next !== solid) {
        solid = next;
        header.dataset.solid = String(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pb-header" data-solid="false" ref={headerRef}>
      <a className="pb-header__brand" href="/" aria-label="Praters Bakery home">
        <BrandLockup />
      </a>
      <nav className="pb-header__links" aria-label="Main">
        <a href="#menu">Menu</a>
        <a href="#how">How it works</a>
        <a href="#reviews">Reviews</a>
        <a href="#visit">Visit</a>
      </nav>
      <a className="pb-header__rating" href="#reviews" aria-label="Rated 5.0 from 73 Google reviews">
        <span aria-hidden="true">★</span> 5.0
      </a>
      <a className="pb-pin-cta" href="#order">
        <span>Pre-order</span>
      </a>
    </header>
  );
}
