import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Loader as Loader2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Field, Chips, SuccessView } from "./BrandForm";

const schema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  instagram_handle: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  niche: z.string().max(80).optional(),
  followers_count: z.string().max(20).optional(),
  engagement_rate: z.string().max(10).optional(),
  platforms: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
  portfolio_links: z.string().max(1000).optional(),
  content_type: z.string().max(200).optional(),
  past_collaborations: z.string().max(1000).optional(),
});

const NICHES = ["Beauty", "Skincare", "Fashion", "Lifestyle", "UGC"];
const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Pinterest", "Threads"];

export default function CreatorForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    full_name: "",
    instagram_handle: "",
    email: "",
    niche: "",
    followers_count: "",
    engagement_rate: "",
    platforms: "",
    location: "",
    portfolio_links: "",
    content_type: "",
    past_collaborations: "",
  });

  const reset = () => {
    setStep(0);
    setDone(false);
    setData({
      full_name: "",
      instagram_handle: "",
      email: "",
      niche: "",
      followers_count: "",
      engagement_rate: "",
      platforms: "",
      location: "",
      portfolio_links: "",
      content_type: "",
      past_collaborations: "",
    });
  };

  const update = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  const submit = async () => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...parsed.data,
      followers_count: parsed.data.followers_count || null,
      engagement_rate: parsed.data.engagement_rate || null,
      platforms: parsed.data.platforms
        ? parsed.data.platforms.split(",").map((p) => p.trim())
        : null,
      portfolio_links: parsed.data.portfolio_links || null,
      content_type: parsed.data.content_type || null,
      past_collaborations: parsed.data.past_collaborations || null,
    };
    const { error } = await supabase.from("creators").insert(payload as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
  };

  const steps = [
    {
      title: "About you",
      fields: (
        <div className="space-y-5">
          <Field label="Full name *">
            <Input
              value={data.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder="Your full name"
              className="luxury-input"
            />
          </Field>
          <Field label="Instagram handle *">
            <Input
              value={data.instagram_handle}
              onChange={(e) => update("instagram_handle", e.target.value)}
              placeholder="@yourhandle"
              className="luxury-input"
            />
          </Field>
          <Field label="Email *">
            <Input
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              className="luxury-input"
            />
          </Field>
        </div>
      ),
    },
    {
      title: "Your niche & platforms",
      fields: (
        <div className="space-y-5">
          <Field label="Niche">
            <Chips options={NICHES} value={data.niche} onChange={(v) => update("niche", v)} />
          </Field>
          <Field label="Primary platforms">
            <Chips
              options={PLATFORMS}
              value={data.platforms}
              onChange={(v) => update("platforms", v)}
            />
          </Field>
          <Field label="Content type">
            <Input
              value={data.content_type}
              onChange={(e) => update("content_type", e.target.value)}
              placeholder="e.g. Reels, Stories, Long-form"
              className="luxury-input"
            />
          </Field>
        </div>
      ),
    },
    {
      title: "Your metrics & experience",
      fields: (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Followers (approximate)">
              <Input
                value={data.followers_count}
                onChange={(e) => update("followers_count", e.target.value)}
                placeholder="e.g. 50k"
                className="luxury-input"
              />
            </Field>
            <Field label="Avg. engagement rate">
              <Input
                value={data.engagement_rate}
                onChange={(e) => update("engagement_rate", e.target.value)}
                placeholder="e.g. 3.5%"
                className="luxury-input"
              />
            </Field>
          </div>
          <Field label="Location">
            <Input
              value={data.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City, Country"
              className="luxury-input"
            />
          </Field>
        </div>
      ),
    },
    {
      title: "Portfolio & experience",
      fields: (
        <div className="space-y-5">
          <Field label="Portfolio or media kit link">
            <Input
              value={data.portfolio_links}
              onChange={(e) => update("portfolio_links", e.target.value)}
              placeholder="https://"
              className="luxury-input"
            />
          </Field>
          <Field label="Past collaborations or notable brand work">
            <Textarea
              rows={3}
              value={data.past_collaborations}
              onChange={(e) => update("past_collaborations", e.target.value)}
              placeholder="Brands you've worked with, campaigns, etc."
              className="luxury-input"
            />
          </Field>
        </div>
      ),
    },
  ];

  const last = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 300);
      }}
    >
      <DialogContent className="max-w-xl bg-background border border-border p-0 overflow-hidden shadow-luxury rounded-none">
        {done ? (
          <SuccessView
            title="Application received."
            subtitle="Thank you for your interest! We'll review your profile and reach out within 5–7 business days if there's a strong fit."
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <div>
            {/* Progress bar */}
            <div className="h-0.5 bg-border">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <DialogHeader className="px-8 pt-8 pb-0">
              <span className="overline-label mb-3 block">
                Creator Application — Step {step + 1} of {steps.length}
              </span>
              <DialogTitle className="font-display text-2xl font-light text-foreground">
                {steps[step].title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Complete all fields to submit your creator application.
              </DialogDescription>
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
