import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 " +
        (scrolled ? "bg-background/96 backdrop-blur-sm border-b border-border" : "bg-transparent")
      }
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-xl font-light tracking-[0.08em] text-foreground">MAISON</span>
            <span className="font-display text-xl font-light tracking-[0.08em] text-gold -mt-1">LUMIÈRE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { href: "#services", label: "Services" },
              { href: "#creators", label: "Creators" },
              { href: "#brands", label: "Brands" },
              { href: "#testimonials", label: "Stories" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/admin"
              className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Admin
            </Link>
            <a
              href="#apply"
              className="font-body text-xs tracking-[0.18em] uppercase border border-foreground px-5 py-2.5 text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={"block h-px w-6 bg-foreground transition-all duration-300 " + (menuOpen ? "rotate-45 translate-y-2" : "")} />
            <span className={"block h-px w-6 bg-foreground transition-all duration-300 " + (menuOpen ? "opacity-0" : "")} />
            <span className={"block h-px w-6 bg-foreground transition-all duration-300 " + (menuOpen ? "-rotate-45 -translate-y-2" : "")} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={
          "md:hidden overflow-hidden transition-all duration-500 bg-background border-b border-border " +
          (menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")
        }
      >
        <nav className="flex flex-col px-6 py-6 gap-5">
          {[
            { href: "#services", label: "Services" },
            { href: "#creators", label: "Creators" },
            { href: "#brands", label: "Brands" },
            { href: "#testimonials", label: "Stories" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-body text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link to="/admin" className="font-body text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
          <a
            href="#apply"
            className="font-body text-xs tracking-[0.18em] uppercase border border-foreground px-5 py-3 text-center text-foreground hover:bg-foreground hover:text-background transition-all"
          >
            Apply Now
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex flex-col leading-none mb-5">
              <span className="font-display text-2xl font-light tracking-[0.08em] text-foreground">MAISON</span>
              <span className="font-display text-2xl font-light tracking-[0.08em] text-gold -mt-1">LUMIÈRE</span>
            </div>
            <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">
              The premier luxury beauty creator agency. Connecting elevated brands with visionary creators since 2021.
            </p>
          </div>

          <div>
            <p className="overline-label mb-5">Agency</p>
            <ul className="space-y-3">
              {["Our Story", "The Roster", "Case Studies", "Press"].map((l) => (
                <li key={l}>
                  <a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors link-underline">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="overline-label mb-5">Work With Us</p>
            <ul className="space-y-3">
              {["For Brands", "For Creators", "Apply Now", "Contact"].map((l) => (
                <li key={l}>
                  <a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors link-underline">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} Maison Lumière. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Instagram"].map((l) => (
              <a key={l} href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
