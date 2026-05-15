import { ArrowRight } from "lucide-react";

/* ─── Services Section ───────────────────────────────────── */
export function ServicesSection() {
  const services = [
    {
      number: "01",
      title: "Creator Curation",
      desc: "We hand-select creators whose aesthetic, values and audience align perfectly with your brand vision. No spray and pray — only intentional partnerships.",
      tag: "For Brands",
    },
    {
      number: "02",
      title: "Campaign Architecture",
      desc: "From concept to deliverable, we build campaigns that feel native to each creator's voice while staying true to your brand's editorial standards.",
      tag: "For Brands",
    },
    {
      number: "03",
      title: "Creator Development",
      desc: "We work with rising talent to refine their positioning, grow their portfolio and connect them with the brands that match their creative identity.",
      tag: "For Creators",
    },
    {
      number: "04",
      title: "Talent Representation",
      desc: "Full-service representation for established creators — contract negotiation, rate guidance, and long-term brand relationship management.",
      tag: "For Creators",
    },
  ];

  return (
    <section id="services" className="px-6 md:px-12 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What We Do"
          title={
            <>
              Elevating beauty
              <br />
              <em className="not-italic text-gradient-warm">collaborations.</em>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {services.map((s) => (
            <div
              key={s.number}
              className="group bg-background p-10 md:p-14 hover:bg-accent/40 transition-colors duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-display text-5xl font-light text-border group-hover:text-champagne transition-colors duration-500">
                  {s.number}
                </span>
                <span className="overline-label border border-border px-2.5 py-1">{s.tag}</span>
              </div>
              <h3 className="font-display text-2xl font-light text-foreground mb-4">{s.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                <span>Learn more</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Creator Roster Preview ─────────────────────────────── */
export function CreatorRoster() {
  const niches = [
    {
      label: "Skincare",
      desc: "Estheticians, ingredient educators, routine architects.",
      img: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "Makeup & Beauty",
      desc: "Editorial artists, everyday glam, avant-garde looks.",
      img: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "Fashion",
      desc: "Stylists, capsule wardrobe voices, editorial storytellers.",
      img: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "Lifestyle",
      desc: "Slow living, wellness rituals, aspirational everyday.",
      img: "https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      label: "UGC Creators",
      desc: "Studio-quality content for paid media. No audience required.",
      img: "https://images.pexels.com/photos/3756165/pexels-photo-3756165.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  return (
    <section id="creators" className="px-6 md:px-12 py-28 bg-accent/20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            eyebrow="Our Creators"
            title={
              <>
                Five niches.
                <br />
                <em className="not-italic text-gradient-warm">Infinite stories.</em>
              </>
            }
            left
          />
          <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">
            Every creator in our roster is personally vetted, aesthetically aligned, and
            strategically matched to brand briefs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {niches.map((n, i) => (
            <div
              key={n.label}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-accent">
                <img
                  src={n.img}
                  alt={n.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500" />
              </div>
              <div className="pt-4">
                <h3 className="font-display text-lg font-light text-foreground">{n.label}</h3>
                <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                  {n.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Brand Collaboration Process ────────────────────────── */
export function BrandProcess() {
  const steps = [
    {
      num: "I",
      title: "The Brief",
      desc: "Share your campaign vision, product positioning, and creator criteria. We absorb your brand language.",
    },
    {
      num: "II",
      title: "The Curation",
      desc: "Within 48 hours, we present a curated shortlist of creators — each with a rationale rooted in aesthetic and audience fit.",
    },
    {
      num: "III",
      title: "The Partnership",
      desc: "We facilitate introductions, manage contracts, and oversee content delivery from concept to final approval.",
    },
    {
      num: "IV",
      title: "The Impact",
      desc: "Post-campaign reporting, performance insights, and relationship nurturing for long-term brand–creator bonds.",
    },
  ];

  return (
    <section id="brands" className="px-6 md:px-12 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="For Brands"
          title={
            <>
              How we build
              <br />
              <em className="not-italic text-gradient-warm">partnerships.</em>
            </>
          }
        />

        <div className="mt-16 relative">
          {/* Connecting line on desktop */}
          <div className="absolute top-9 left-0 right-0 h-px bg-border hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((s) => (
              <div key={s.num} className="relative">
                <div className="flex items-center justify-center w-[4.5rem] h-[4.5rem] border border-border bg-background font-display text-2xl font-light text-gold mb-6 relative z-10">
                  {s.num}
                </div>
                <h3 className="font-display text-xl font-light text-foreground mb-3">{s.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand logos marquee */}
        <div className="mt-20 pt-16 border-t border-border overflow-hidden">
          <p className="overline-label mb-8 text-center">Brands We've Partnered With</p>
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, rep) =>
              [
                "AURÉ",
                "Velvet Skin",
                "NUDE",
                "The Ritual",
                "Soft Hours",
                "BLOOM",
                "Porcelain",
                "Elixir Co.",
                "AURÉ",
                "Velvet Skin",
                "NUDE",
                "The Ritual",
                "Soft Hours",
                "BLOOM",
                "Porcelain",
                "Elixir Co.",
              ].map((b, i) => (
                <span
                  key={`${rep}-${i}`}
                  className="font-display text-xl font-light text-muted-foreground/60 hover:text-foreground transition-colors flex-shrink-0"
                >
                  {b}
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Creator Onboarding Section ─────────────────────────── */
export function CreatorOnboarding() {
  const benefits = [
    {
      title: "Curated Brand Matches",
      desc: "We only send you briefs that genuinely fit your aesthetic and values. No misaligned pitches.",
    },
    {
      title: "Transparent Rates",
      desc: "Guidance on industry-standard rates and support negotiating deals that reflect your worth.",
    },
    {
      title: "Agency Backing",
      desc: "Professional representation — contracts, communication, and creative protection handled for you.",
    },
    {
      title: "Long-term Relationships",
      desc: "We build careers, not one-off posts. Our creators often become brand ambassadors.",
    },
  ];

  return (
    <section className="px-6 md:px-12 py-28 bg-warm-gradient">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="overline-label line-ornament mb-6 block">For Creators</span>
            <h2 className="display-xl text-foreground mb-8">
              Join the
              <br />
              <em className="not-italic text-gradient-warm">inner circle.</em>
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-md">
              Maison Lumière represents a selective roster of beauty creators across all tiers —
              from rising micro-voices to established icons. We believe in quality over quantity.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="border-l-2 border-champagne pl-4">
                  <h4 className="font-display text-base font-light text-foreground mb-1">
                    {b.title}
                  </h4>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3768163/pexels-photo-3768163.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Creator applying makeup"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-background border border-border p-6 shadow-luxury">
              <div className="font-display text-4xl font-light text-foreground">
                340<span className="text-gold">+</span>
              </div>
              <div className="overline-label mt-1">Active Creators</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────── */
export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Maison Lumière understood our brand's aesthetic before we even finished explaining it. The creators they introduced were extraordinary — every campaign has outperformed our KPIs.",
      name: "Sophie Renard",
      role: "Marketing Director, AURÉ Paris",
      img: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    {
      quote:
        "They matched me with three brands I genuinely love. The deals were fair, the briefs were creative, and I finally felt like my work was being valued properly.",
      name: "Isabelle Chen",
      role: "Beauty Creator, 240k followers",
      img: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    {
      quote:
        "Working with an agency that understands the luxury market changed everything. No more creators who don't fit our positioning. Just beautiful, on-brand content every time.",
      name: "Marcus Webb",
      role: "Creative Director, Velvet Skin",
      img: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
  ];

  return (
    <section id="testimonials" className="px-6 md:px-12 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What They Say"
          title={
            <>
              Stories of
              <br />
              <em className="not-italic text-gradient-warm">transformation.</em>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="border border-border p-8 hover:shadow-luxury transition-shadow duration-500 animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="font-display text-4xl text-gold/40 leading-none mb-4">"</div>
              <blockquote className="font-body text-sm text-muted-foreground leading-relaxed italic">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-body text-sm font-medium text-foreground">{t.name}</div>
                  <div className="font-body text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ────────────────────────────────────────── */
export function CTASection({ onBrand, onCreator }: { onBrand: () => void; onCreator: () => void }) {
  return (
    <section id="apply" className="px-6 md:px-12 py-28 bg-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="overline-label text-background/50 mb-6 block line-ornament">
              Begin Your Journey
            </span>
            <h2 className="display-xl text-background leading-tight">
              Ready to
              <br />
              collaborate?
            </h2>
          </div>
          <div>
            <p className="font-body text-base text-background/60 leading-relaxed mb-10">
              Whether you are a brand seeking the perfect creator or a creator ready to elevate your
              collaborations — we want to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBrand}
                className="font-body text-xs tracking-[0.18em] uppercase border border-background px-7 py-4 text-background hover:bg-background hover:text-foreground transition-all duration-300"
              >
                Submit a Brand Brief
              </button>
              <button
                onClick={onCreator}
                className="font-body text-xs tracking-[0.18em] uppercase border border-background/30 bg-background/10 px-7 py-4 text-background hover:border-background hover:bg-background hover:text-foreground transition-all duration-300"
              >
                Apply as a Creator
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Shared: Section Heading ────────────────────────────── */
function SectionHeading({
  eyebrow,
  title,
  left = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  left?: boolean;
}) {
  return (
    <div className={left ? "" : "mx-auto max-w-3xl text-center"}>
      <span className="overline-label line-ornament mb-4 block">{eyebrow}</span>
      <h2 className="display-lg text-foreground">{title}</h2>
    </div>
  );
}
