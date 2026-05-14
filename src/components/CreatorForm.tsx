import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Field, Chips, SuccessView } from "./BrandForm";

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  instagram_handle: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  niche: z.string().max(80).optional(),
  followers_count: z.string().max(40).optional(),
  engagement_rate: z.string().max(40).optional(),
  platforms: z.array(z.string()).optional(),
  location: z.string().max(120).optional(),
  portfolio_links: z.string().max(500).optional(),
  past_collaborations: z.string().max(500).optional(),
  content_type: z.string().max(120).optional(),
  media_kit_url: z.string().max(255).optional(),
});

const NICHES = ["Beauty", "Skincare", "Fashion", "Lifestyle", "UGC"];
const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Pinterest", "Twitter/X"];
const FOLLOWERS = ["< 10k", "10k – 50k", "50k – 250k", "250k – 1M", "1M+"];

export function CreatorForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    full_name: "", instagram_handle: "", email: "", phone: "", niche: "", followers_count: "", engagement_rate: "",
    platforms: [] as string[], location: "", portfolio_links: "", past_collaborations: "", content_type: "", media_kit_url: "",
  });

  const reset = () => {
    setStep(0);
    setDone(false);
    setData({ full_name: "", instagram_handle: "", email: "", phone: "", niche: "", followers_count: "", engagement_rate: "", platforms: [], location: "", portfolio_links: "", past_collaborations: "", content_type: "", media_kit_url: "" });
  };

  const update = <K extends keyof typeof data>(k: K, v: typeof data[K]) => setData((d) => ({ ...d, [k]: v }));
  const togglePlatform = (p: string) => setData((d) => ({
    ...d,
    platforms: d.platforms.includes(p) ? d.platforms.filter((x) => x !== p) : [...d.platforms, p],
  }));

  const submit = async () => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("creators").insert(parsed.data as never);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  const steps = [
    {
      title: "Your profile",
      fields: (
        <div className="space-y-5">
          <Field label="Full name *">
            <Input value={data.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Your name" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram handle *">
              <Input value={data.instagram_handle} onChange={(e) => update("instagram_handle", e.target.value)} placeholder="@yourname" />
            </Field>
            <Field label="Location">
              <Input value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email *">
              <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" />
            </Field>
            <Field label="Phone">
              <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 …" />
            </Field>
          </div>
        </div>
      ),
    },
    {
      title: "Your reach & niche",
      fields: (
        <div className="space-y-5">
          <Field label="Niche">
            <Chips options={NICHES} value={data.niche} onChange={(v) => update("niche", v)} />
          </Field>
          <Field label="Follower range (main platform)">
            <Chips options={FOLLOWERS} value={data.followers_count} onChange={(v) => update("followers_count", v)} />
          </Field>
          <Field label="Platforms">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={
                    "font-body text-xs tracking-[0.1em] uppercase border px-4 py-2 transition-all duration-200 " +
                    (data.platforms.includes(p)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground")
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Engagement rate">
            <Input value={data.engagement_rate} onChange={(e) => update("engagement_rate", e.target.value)} placeholder="e.g. 4.8%" />
          </Field>
        </div>
      ),
    },
    {
      title: "Your portfolio",
      fields: (
        <div className="space-y-5">
          <Field label="Content type">
            <Input value={data.content_type} onChange={(e) => update("content_type", e.target.value)} placeholder="Reels, UGC ads, editorial, tutorials…" />
          </Field>
          <Field label="Portfolio links">
            <Textarea rows={2} value={data.portfolio_links} onChange={(e) => update("portfolio_links", e.target.value)} placeholder="Drive, Notion, IG highlights, website…" />
          </Field>
          <Field label="Past brand collaborations">
            <Textarea rows={2} value={data.past_collaborations} onChange={(e) => update("past_collaborations", e.target.value)} placeholder="Brand names, campaign type, dates" />
          </Field>
          <Field label="Media kit URL">
            <Input value={data.media_kit_url} onChange={(e) => update("media_kit_url", e.target.value)} placeholder="https://…" />
          </Field>
        </div>
      ),
    },
  ];

  const last = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 300); }}>
      <DialogContent className="max-w-xl bg-background border border-border p-0 overflow-hidden shadow-luxury rounded-none">
        {done ? (
          <SuccessView
            title="Application received."
            subtitle="We carefully review every creator application. If your profile aligns with our roster, we will be in touch within 5 business days."
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <div>
            {/* Progress bar */}
            <div className="h-0.5 bg-border">
              <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <DialogHeader className="px-8 pt-8 pb-0">
              <span className="overline-label mb-3 block">Creator Application — Step {step + 1} of {steps.length}</span>
              <DialogTitle className="font-display text-2xl font-light text-foreground">{steps[step].title}</DialogTitle>
              <DialogDescription className="sr-only">Apply to join the Maison Lumière creator roster.</DialogDescription>
            </DialogHeader>

            <div className="px-8 py-6">{steps[step].fields}</div>

            <div className="flex items-center justify-between border-t border-border px-8 py-5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                Back
              </button>
              {last ? (
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="font-body text-xs tracking-[0.18em] uppercase border border-foreground bg-foreground text-background px-7 py-3 hover:bg-transparent hover:text-foreground transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  Submit Application
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="font-body text-xs tracking-[0.18em] uppercase border border-foreground px-7 py-3 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 flex items-center gap-2"
                >
                  Continue <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
