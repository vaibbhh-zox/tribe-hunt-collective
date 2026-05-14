import { ArrowRight, MessageCircle, Search, Send, Sparkles, Shield, Zap, Heart } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { icon: Send, title: "Submit your brief", desc: "Brands tell us their goals, niche and budget. Creators share their profile and reach." },
    { icon: Search, title: "We curate the match", desc: "Our team hand-picks creators that fit each campaign — no spammy DMs, no guessing." },
    { icon: MessageCircle, title: "Collaborate & launch", desc: "We connect both sides, terms get agreed, and the campaign goes live. Simple." },
  ];
  return (
    <section id="how" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How it works" title={<>Three steps. <span className="text-gradient">Zero friction.</span></>} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="glass relative overflow-hidden rounded-3xl p-7 transition hover:border-foreground/20">
              <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-mono text-muted-foreground">0{i + 1}</div>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyTribeHunt() {
  const items = [
    { icon: Shield, title: "Vetted on both sides", desc: "Every brand and creator is reviewed before any intro. Quality > quantity." },
    { icon: Zap, title: "Faster than agencies", desc: "Most matches happen within 48 hours. No drawn-out scoping calls." },
    { icon: Heart, title: "Niche-first", desc: "Beauty, skincare, fashion, lifestyle, UGC. We know the people who actually convert." },
    { icon: Sparkles, title: "Built for ROI", desc: "We optimise for paid collabs that perform — not just vanity posts." },
  ];
  return (
    <section id="why" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Why Tribe Hunt" title={<>Built for the people <span className="text-gradient">actually doing the work.</span></>} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="glass rounded-2xl p-6 transition hover:bg-card/60">
              <it.icon className="h-5 w-5 text-pink" />
              <h3 className="mt-4 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection() {
  const cats = [
    { name: "Beauty", desc: "Makeup artists, beauty enthusiasts, product reviewers." },
    { name: "Skincare", desc: "Estheticians, skincare educators, routine creators." },
    { name: "Fashion", desc: "Stylists, fit-check creators, capsule wardrobe voices." },
    { name: "Lifestyle", desc: "Day-in-the-life, wellness, slow living, home." },
    { name: "UGC Creators", desc: "On-brand content for ads, no audience required." },
  ];
  return (
    <section id="categories" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Creator categories" title={<>Niches we <span className="text-gradient">obsess over.</span></>} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c, i) => (
            <div
              key={c.name}
              className="group glass relative overflow-hidden rounded-3xl p-7 transition hover:border-foreground/30"
              style={{ background: i === 0 ? "linear-gradient(135deg, oklch(0.15 0.04 340 / 0.7), oklch(0.11 0.015 280 / 0.5))" : undefined }}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">0{i + 1}</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              <ArrowRight className="absolute right-6 top-6 h-4 w-4 text-muted-foreground transition group-hover:text-pink group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandCollabs() {
  const logos = ["Glow Co.", "VELVET", "auré", "MOOD", "Studio Nine", "Soft Skin", "Halo Beauty", "NORTH"];
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Brand collaborations" title={<>Trusted by <span className="text-gradient">scaling brands.</span></>} />
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">
          {logos.map((l) => (
            <div key={l} className="flex h-24 items-center justify-center bg-card text-lg font-medium tracking-tight text-muted-foreground transition hover:text-foreground">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const t = [
    { quote: "Tribe Hunt found us 12 perfect-fit creators in a week. Our launch sold out.", name: "Maya R.", role: "Founder, Glow Co." },
    { quote: "First platform that actually understood my niche. Three paid deals in my first month.", name: "Jules A.", role: "Beauty creator, 84k" },
    { quote: "It's like having an in-house influencer team — minus the agency markup.", name: "Daniel K.", role: "Marketing Lead, VELVET" },
  ];
  return (
    <section id="testimonials" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Testimonials" title={<>Loved by brands. <span className="text-gradient">Trusted by creators.</span></>} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.map((item) => (
            <figure key={item.name} className="glass rounded-3xl p-7">
              <blockquote className="text-base leading-relaxed">"{item.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-brand" />
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection({ onBrand, onCreator }: { onBrand: () => void; onCreator: () => void }) {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-12 text-center md:p-20">
          <div className="absolute inset-0 bg-glow opacity-60" />
          <div className="relative">
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl" style={{ letterSpacing: "-0.03em" }}>
              Ready to <span className="text-gradient">find your tribe?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Submit your details — we'll be in touch within 48 hours.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onBrand}
                className="rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
              >
                I'm a Brand
              </button>
              <button
                onClick={onCreator}
                className="rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:border-foreground/30"
              >
                I'm a Creator
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-xs font-mono uppercase tracking-[0.2em] text-pink">{eyebrow}</div>
      <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
        {title}
      </h2>
    </div>
  );
}
