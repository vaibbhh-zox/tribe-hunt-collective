import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="glass flex items-center justify-between rounded-full px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-brand shadow-glow" />
            <span className="text-base font-semibold tracking-tight">Tribe Hunt</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#why" className="hover:text-foreground transition">Why us</a>
            <a href="#categories" className="hover:text-foreground transition">Creators</a>
            <a href="#testimonials" className="hover:text-foreground transition">Stories</a>
          </nav>
          <Link
            to="/admin"
            className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-brand" />
          <span className="text-sm font-semibold">Tribe Hunt</span>
          <span className="text-sm text-muted-foreground ml-3">© {new Date().getFullYear()}</span>
        </div>
        <p className="text-xs text-muted-foreground">Where brands meet creators.</p>
      </div>
    </footer>
  );
}
