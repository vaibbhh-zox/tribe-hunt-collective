interface HeroProps {
  onBrand: () => void;
  onCreator: () => void;
}

export function Hero({ onBrand, onCreator }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-24 pt-32 px-6 md:px-12 overflow-hidden">
      {/* Subtle warm background gradient */}
      <div className="absolute inset-0 bg-warm-gradient -z-10" />

      {/* Editorial large text backdrop */}
      <div className="absolute top-0 right-0 -z-10 overflow-hidden pointer-events-none select-none">
        <span
          className="font-display text-[22vw] font-light text-foreground/[0.03] leading-none whitespace-nowrap"
          aria-hidden
        >
          BEAUTÉ
        </span>
      </div>

      <div className="mx-auto max-w-7xl w-full">
        {/* Eyebrow */}
        <div className="animate-fade-up flex items-center gap-3 mb-10">
          <span className="block w-10 h-px bg-gold opacity-70" />
          <span className="overline-label">Luxury Beauty Creator Agency</span>
        </div>

        {/* Main headline — editorial split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-end">
          <div className="lg:col-span-8">
            <h1
              className="display-hero text-foreground animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Where art
              <br />
              <em className="not-italic text-gold">meets</em>
              <br />
              influence.
            </h1>
          </div>

          <div
            className="lg:col-span-4 lg:pb-4 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xs">
              We curate extraordinary partnerships between visionary beauty brands and the creators who define culture.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBrand}
                className="font-body text-xs tracking-[0.18em] uppercase border border-foreground bg-foreground text-background px-7 py-4 hover:bg-transparent hover:text-foreground transition-all duration-300"
              >
                For Brands
              </button>
              <button
                onClick={onCreator}
                className="font-body text-xs tracking-[0.18em] uppercase border border-foreground px-7 py-4 text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                For Creators
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="mt-20 grid grid-cols-3 gap-0 border-t border-border pt-8 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { v: "340+", l: "Elite Creators" },
            { v: "180+", l: "Brand Campaigns" },
            { v: "98%", l: "Client Return Rate" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={"py-2 " + (i > 0 ? "pl-8 md:pl-14 border-l border-border" : "")}
            >
              <div className="font-display text-3xl md:text-5xl font-light text-foreground">{s.v}</div>
              <div className="overline-label mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1s" }}>
        <span className="overline-label text-[0.55rem]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-foreground/20 to-transparent" />
      </div>
    </section>
  );
}
