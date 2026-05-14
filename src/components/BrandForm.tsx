import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Loader2, ArrowRight, Building2 } from "lucide-react";
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

  const reset = () => { setStep(0); setDone(false); setData({ brand_name: "", website: "", instagram_handle: "", contact_person: "", email: "", budget_range: "", niche: "", campaign_goal: "", creators_needed: "", deliverables: "", notes: "" }); };

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
    { title: "About your brand", fields: (
      <div className="space-y-4">
        <Field label="Brand name *"><Input value={data.brand_name} onChange={(e) => update("brand_name", e.target.value)} placeholder="Glow Co." /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Website"><Input value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" /></Field>
          <Field label="Instagram handle"><Input value={data.instagram_handle} onChange={(e) => update("instagram_handle", e.target.value)} placeholder="@yourbrand" /></Field>
        </div>
      </div>
    )},
    { title: "How we reach you", fields: (
      <div className="space-y-4">
        <Field label="Contact person *"><Input value={data.contact_person} onChange={(e) => update("contact_person", e.target.value)} placeholder="Your full name" /></Field>
        <Field label="Email *"><Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@brand.com" /></Field>
      </div>
    )},
    { title: "The campaign", fields: (
      <div className="space-y-4">
        <Field label="Niche">
          <Chips options={NICHES} value={data.niche} onChange={(v) => update("niche", v)} />
        </Field>
        <Field label="Budget range">
          <Chips options={BUDGETS} value={data.budget_range} onChange={(v) => update("budget_range", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Creators needed"><Input value={data.creators_needed} onChange={(e) => update("creators_needed", e.target.value)} placeholder="e.g. 5-10" /></Field>
          <Field label="Deliverables"><Input value={data.deliverables} onChange={(e) => update("deliverables", e.target.value)} placeholder="2 reels, 3 stories" /></Field>
        </div>
        <Field label="Campaign goal"><Textarea rows={3} value={data.campaign_goal} onChange={(e) => update("campaign_goal", e.target.value)} placeholder="What does success look like?" /></Field>
        <Field label="Notes"><Textarea rows={2} value={data.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything else?" /></Field>
      </div>
    )},
  ];

  const last = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 300); }}>
      <DialogContent className="max-w-xl glass-strong border-border p-0 overflow-hidden">
        {done ? (
          <SuccessView title="You're in." subtitle="We'll review your brief and reach out within 48 hours." onClose={() => onOpenChange(false)} />
        ) : (
          <div>
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-pink" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Brand intake</span>
              </div>
              <DialogTitle className="text-2xl tracking-tight">{steps[step].title}</DialogTitle>
              <DialogDescription className="text-muted-foreground">Step {step + 1} of {steps.length}</DialogDescription>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gradient-brand transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
            </DialogHeader>
            <div className="p-6">{steps[step].fields}</div>
            <div className="flex items-center justify-between border-t border-border p-4">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                Back
              </button>
              {last ? (
                <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-60">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Find Creators
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={
            "rounded-full border px-3.5 py-1.5 text-xs transition " +
            (value === o ? "border-pink bg-pink/10 text-foreground ring-glow" : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-foreground/30")
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
    <div className="px-8 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand shadow-glow animate-fade-up">
        <Check className="h-8 w-8 text-primary-foreground" />
      </div>
      <h3 className="mt-6 text-2xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <button onClick={onClose} className="mt-8 rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
        Done
      </button>
    </div>
  );
}

export { Field, Chips };
