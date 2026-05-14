import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  brand_name: z.string().trim().min(1, "Required").max(120),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  instagram_handle: z.string().trim().max(80).optional().or(z.literal("")),
  contact_person: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  budget_range: z.string().max(80).optional(),
  niche: z.string().max(80).optional(),
  campaign_goal: z.string().max(500).optional(),
  creators_needed: z.string().max(40).optional(),
  deliverables: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

const NICHES = ["Beauty", "Skincare", "Fashion", "Lifestyle", "UGC"];
const BUDGETS = ["< $1k", "$1k – $5k", "$5k – $15k", "$15k – $50k", "$50k+"];

export function BrandForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    brand_name: "", website: "", instagram_handle: "", contact_person: "", email: "",
    budget_range: "", niche: "", campaign_goal: "", creators_needed: "", deliverables: "", notes: "",
  });

  const reset = () => {
    setStep(0);
    setDone(false);
    setData({ brand_name: "", website: "", instagram_handle: "", contact_person: "", email: "", budget_range: "", niche: "", campaign_goal: "", creators_needed: "", deliverables: "", notes: "" });
  };

  const update = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  const submit = async () => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    const payload = { ...parsed.data, website: parsed.data.website || null, instagram_handle: parsed.data.instagram_handle || null };
    const { error } = await supabase.from("brands").insert(payload as never);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  const steps = [
    {
      title: "About your brand",
      fields: (
        <div className="space-y-5">
          <Field label="Brand name *">
            <Input value={data.brand_name} onChange={(e) => update("brand_name", e.target.value)} placeholder="e.g. Auré Beauté" className="luxury-input" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website">
              <Input value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className="luxury-input" />
            </Field>
            <Field label="Instagram">
              <Input value={data.instagram_handle} onChange={(e) => update("instagram_handle", e.target.value)} placeholder="@yourbrand" className="luxury-input" />
            </Field>
          </div>
        </div>
      ),
    },
    {
      title: "Your contact details",
      fields: (
        <div className="space-y-5">
          <Field label="Contact person *">
            <Input value={data.contact_person} onChange={(e) => update("contact_person", e.target.value)} placeholder="Your full name" className="luxury-input" />
          </Field>
          <Field label="Email *">
            <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@brand.com" className="luxury-input" />
          </Field>
        </div>
      ),
    },
    {
      title: "Campaign details",
      fields: (
        <div className="space-y-5">
          <Field label="Niche">
            <Chips options={NICHES} value={data.niche} onChange={(v) => update("niche", v)} />
          </Field>
          <Field label="Budget range">
            <Chips options={BUDGETS} value={data.budget_range} onChange={(v) => update("budget_range", v)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Creators needed">
              <Input value={data.creators_needed} onChange={(e) => update("creators_needed", e.target.value)} placeholder="e.g. 5–10" className="luxury-input" />
            </Field>
            <Field label="Deliverables">
              <Input value={data.deliverables} onChange={(e) => update("deliverables", e.target.value)} placeholder="2 reels, 3 stories" className="luxury-input" />
            </Field>
          </div>
          <Field label="Campaign goal">
            <Textarea rows={3} value={data.campaign_goal} onChange={(e) => update("campaign_goal", e.target.value)} placeholder="What does success look like?" className="luxury-input" />
          </Field>
          <Field label="Additional notes">
            <Textarea rows={2} value={data.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything else we should know?" className="luxury-input" />
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
            title="Brief received."
            subtitle="We will review your campaign requirements and be in touch within 48 hours with a curated creator shortlist."
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <div>
            {/* Progress bar */}
            <div className="h-0.5 bg-border">
              <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <DialogHeader className="px-8 pt-8 pb-0">
              <span className="overline-label mb-3 block">Brand Brief — Step {step + 1} of {steps.length}</span>
              <DialogTitle className="font-display text-2xl font-light text-foreground">{steps[step].title}</DialogTitle>
              <DialogDescription className="sr-only">Complete all fields to submit your brand brief.</DialogDescription>
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
                  Submit Brief
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

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block overline-label">{label}</Label>
      {children}
    </div>
  );
}

export function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={
            "font-body text-xs tracking-[0.1em] uppercase border px-4 py-2 transition-all duration-200 " +
            (value === o
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground")
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function SuccessView({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="px-10 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center border border-gold/50 mb-8">
        <Check className="h-6 w-6 text-gold" />
      </div>
      <h3 className="font-display text-3xl font-light text-foreground">{title}</h3>
      <p className="mt-3 font-body text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">{subtitle}</p>
      <button
        onClick={onClose}
        className="mt-10 font-body text-xs tracking-[0.18em] uppercase border border-foreground px-7 py-3 text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
      >
        Close
      </button>
    </div>
  );
}
