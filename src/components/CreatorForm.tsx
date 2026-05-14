import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowRight, User } from "lucide-react";
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

  const reset = () => { setStep(0); setDone(false); setData({ full_name: "", instagram_handle: "", email: "", phone: "", niche: "", followers_count: "", engagement_rate: "", platforms: [], location: "", portfolio_links: "", past_collaborations: "", content_type: "", media_kit_url: "" }); };

  const update = <K extends keyof typeof data>(k: K, v: typeof data[K]) => setData((d) => ({ ...d, [k]: v }));
  const togglePlatform = (p: string) => setData((d) => ({ ...d, platforms: d.platforms.includes(p) ? d.platforms.filter((x) => x !== p) : [...d.platforms, p] }));

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
    { title: "Tell us about you", fields: (
      <div className="space-y-4">
        <Field label="Full name *"><Input value={data.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Your name" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Instagram handle *"><Input value={data.instagram_handle} onChange={(e) => update("instagram_handle", e.target.value)} placeholder="@yourname" /></Field>
          <Field label="Location"><Input value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email *"><Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" /></Field>
          <Field label="Phone"><Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 …" /></Field>
        </div>
      </div>
    )},
    { title: "Your reach", fields: (
      <div className="space-y-4">
        <Field label="Niche"><Chips options={NICHES} value={data.niche} onChange={(v) => update("niche", v)} /></Field>
        <Field label="Followers (main platform)"><Chips options={FOLLOWERS} value={data.followers_count} onChange={(v) => update("followers_count", v)} /></Field>
        <Field label="Platforms">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button key={p} type="button" onClick={() => togglePlatform(p)}
                className={"rounded-full border px-3.5 py-1.5 text-xs transition " + (data.platforms.includes(p) ? "border-pink bg-pink/10 text-foreground ring-glow" : "border-border bg-card/40 text-muted-foreground hover:text-foreground")}>
                {p}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Engagement rate"><Input value={data.engagement_rate} onChange={(e) => update("engagement_rate", e.target.value)} placeholder="e.g. 4.8%" /></Field>
      </div>
    )},
    { title: "Your work", fields: (
      <div className="space-y-4">
        <Field label="Content type"><Input value={data.content_type} onChange={(e) => update("content_type", e.target.value)} placeholder="Reels, UGC ads, GRWM…" /></Field>
        <Field label="Portfolio links"><Textarea rows={2} value={data.portfolio_links} onChange={(e) => update("portfolio_links", e.target.value)} placeholder="Drive, Notion, IG highlights…" /></Field>
        <Field label="Past brand collaborations"><Textarea rows={2} value={data.past_collaborations} onChange={(e) => update("past_collaborations", e.target.value)} placeholder="Brand names, dates" /></Field>
        <Field label="Media kit URL"><Input value={data.media_kit_url} onChange={(e) => update("media_kit_url", e.target.value)} placeholder="https://…" /></Field>
      </div>
    )},
  ];

  const last = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 300); }}>
      <DialogContent className="max-w-xl glass-strong border-border p-0 overflow-hidden">
        {done ? (
          <SuccessView title="Welcome to the tribe." subtitle="We've got your profile. We'll reach out when a fitting collab comes up." onClose={() => onOpenChange(false)} />
        ) : (
          <div>
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-pink" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Creator onboarding</span>
              </div>
              <DialogTitle className="text-2xl tracking-tight">{steps[step].title}</DialogTitle>
              <DialogDescription>Step {step + 1} of {steps.length}</DialogDescription>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gradient-brand transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
            </DialogHeader>
            <div className="p-6">{steps[step].fields}</div>
            <div className="flex items-center justify-between border-t border-border p-4">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30">Back</button>
              {last ? (
                <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-60">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Join Tribe Hunt
                </button>
              ) : (
                <button onClick={() => setStep((s) => s + 1)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02]">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
