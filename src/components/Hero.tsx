import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onBrand: () => void;
  onCreator: () => void;
}

export function Hero({ onBrand, onCreator }: HeroProps) {
  return (
    <section className="relative pt-40 pb-24 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-pink" />
          Lead-gen for influencer marketing
        </div>

        <h1
          className="animate-fade-up mt-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.1s", letterSpacing: "-0.04em" }}
        >
          Where{" "}
          <span className="text-gradient">Brands</span>
          <br />
          Meet{" "}
          <span className="text-gradient">Creators.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          Helping brands discover the right creators — and helping creators land
          paid collaborations they actually want.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={onBrand}
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.03] hover:shadow-[0_25px_90px_-15px_oklch(0.72_0.22_340/0.7)]"
          >
            I'm a Brand
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={onCreator}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-foreground/30 hover:bg-card/70"
          >
            I'm a Creator
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div
          className="animate-fade-up mt-20 grid grid-cols-3 gap-6 sm:gap-12"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { v: "2,400+", l: "Creators" },
            { v: "180+", l: "Brand campaigns" },
            { v: "5", l: "Core niches" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-2xl font-bold text-gradient sm:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
