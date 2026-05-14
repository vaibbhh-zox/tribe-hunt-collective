import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, LogOut, Search, Download, Building2, User as UserIcon, Mail, Instagram, SlidersHorizontal } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type LeadStatus = "new" | "contacted" | "in_progress" | "closed";

const STATUSES: { v: LeadStatus; label: string }[] = [
  { v: "new", label: "New" },
  { v: "contacted", label: "Contacted" },
  { v: "in_progress", label: "In Progress" },
  { v: "closed", label: "Closed" },
];

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "oklch(0.55 0.15 150)",
  contacted: "oklch(0.55 0.15 220)",
  in_progress: "oklch(0.68 0.1 72)",
  closed: "oklch(0.55 0.02 55)",
};

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("brands").select("id").limit(1).then(({ error }) => { setIsAdmin(!error); });
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return <LoginView />;
  if (!isAdmin) return <NoAccessView email={session.user.email ?? ""} />;
  return <Dashboard email={session.user.email ?? ""} />;
}

function LoginView() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    const { error } = await fn;
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "signup") toast.success("Check your email to confirm your account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <form onSubmit={submit} className="w-full max-w-md border border-border bg-card p-10 shadow-card-light">
        <div className="flex flex-col leading-none mb-8">
          <span className="font-display text-xl font-light tracking-[0.08em]">MAISON</span>
          <span className="font-display text-xl font-light tracking-[0.08em] text-gold -mt-1">LUMIÈRE</span>
        </div>
        <h1 className="font-display text-2xl font-light text-foreground mb-1">
          {mode === "signin" ? "Admin sign in" : "Create account"}
        </h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Access the leads dashboard.</p>
        <div className="space-y-5">
          <div>
            <Label className="overline-label mb-2 block">Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" />
          </div>
          <div>
            <Label className="overline-label mb-2 block">Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background" />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full font-body text-xs tracking-[0.18em] uppercase border border-foreground bg-foreground text-background py-3.5 hover:bg-transparent hover:text-foreground transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="h-3 w-3 animate-spin" />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => setMode((m) => m === "signin" ? "signup" : "signin")}
          className="mt-4 w-full font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

function NoAccessView({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-md border border-border bg-card p-10 text-center shadow-card-light">
        <h1 className="font-display text-2xl font-light text-foreground">No admin access</h1>
        <p className="mt-3 font-body text-sm text-muted-foreground">
          Signed in as <span className="text-foreground">{email}</span>, but this account has no admin role yet.
        </p>
        <p className="mt-3 font-body text-xs text-muted-foreground">
          The agency owner must grant the <code className="text-gold">admin</code> role in <code className="text-gold">user_roles</code>.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-8 font-body text-xs tracking-[0.15em] uppercase border border-border px-5 py-2.5 hover:border-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

type Brand = {
  id: string; brand_name: string; website: string | null; instagram_handle: string | null;
  contact_person: string; email: string; budget_range: string | null; niche: string | null;
  campaign_goal: string | null; creators_needed: string | null; deliverables: string | null;
  notes: string | null; admin_notes: string | null; status: LeadStatus; created_at: string;
};
type Creator = {
  id: string; full_name: string; instagram_handle: string; email: string; phone: string | null;
  niche: string | null; followers_count: string | null; engagement_rate: string | null;
  platforms: string[] | null; location: string | null; portfolio_links: string | null;
  past_collaborations: string | null; content_type: string | null; media_kit_url: string | null;
  admin_notes: string | null; status: LeadStatus; created_at: string;
};

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<"brands" | "creators">("brands");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<Brand | Creator | null>(null);

  const load = async () => {
    const [b, c] = await Promise.all([
      supabase.from("brands").select("*").order("created_at", { ascending: false }),
      supabase.from("creators").select("*").order("created_at", { ascending: false }),
    ]);
    if (b.data) setBrands(b.data as Brand[]);
    if (c.data) setCreators(c.data as Creator[]);
  };

  useEffect(() => { load(); }, []);

  const filteredBrands = useMemo(() => brands.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return [b.brand_name, b.contact_person, b.email, b.niche, b.instagram_handle].some((f) => f?.toLowerCase().includes(s));
  }), [brands, search, statusFilter]);

  const filteredCreators = useMemo(() => creators.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return [c.full_name, c.email, c.niche, c.instagram_handle, c.location].some((f) => f?.toLowerCase().includes(s));
  }), [creators, search, statusFilter]);

  const exportCsv = () => {
    const rows = tab === "brands" ? filteredBrands : filteredCreators;
    if (!rows.length) { toast.error("Nothing to export"); return; }
    const keys = Object.keys(rows[0]);
    const csv = [
      keys.join(","),
      ...rows.map((r) => keys.map((k) => {
        const v = (r as Record<string, unknown>)[k];
        const s = v == null ? "" : Array.isArray(v) ? v.join("; ") : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      }).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    const table = tab === "brands" ? "brands" : "creators";
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    load();
    if (selected && selected.id === id) setSelected({ ...selected, status });
  };

  const updateNotes = async (id: string, admin_notes: string) => {
    const table = tab === "brands" ? "brands" : "creators";
    const { error } = await supabase.from(table).update({ admin_notes }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Notes saved");
    load();
  };

  const counts = {
    brands: brands.length,
    creators: creators.length,
    newLeads: [...brands, ...creators].filter((x) => x.status === "new").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-light tracking-[0.08em]">MAISON</span>
            <span className="font-display text-base font-light tracking-[0.08em] text-gold -mt-0.5">LUMIÈRE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="overline-label hidden sm:block">{email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="font-body text-xs tracking-[0.12em] uppercase flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Stat label="Brand Briefs" value={counts.brands} icon={Building2} />
          <Stat label="Creator Applications" value={counts.creators} icon={UserIcon} />
          <Stat label="New This Week" value={counts.newLeads} icon={SlidersHorizontal} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-5">
          <div className="inline-flex border border-border">
            <TabBtn active={tab === "brands"} onClick={() => setTab("brands")}>Brands ({brands.length})</TabBtn>
            <TabBtn active={tab === "creators"} onClick={() => setTab("creators")}>Creators ({creators.length})</TabBtn>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-9 w-52 bg-background text-sm" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
              className="border border-border bg-background px-3 py-2 font-body text-xs tracking-wide text-foreground"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
            <button
              onClick={exportCsv}
              className="font-body text-xs tracking-[0.12em] uppercase flex items-center gap-1.5 border border-border px-3 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border overflow-hidden">
          {tab === "brands" ? (
            <BrandsTable rows={filteredBrands} onSelect={setSelected} onStatus={updateStatus} />
          ) : (
            <CreatorsTable rows={filteredCreators} onSelect={setSelected} onStatus={updateStatus} />
          )}
        </div>
      </div>

      {selected && (
        <DetailDrawer
          lead={selected}
          kind={tab}
          onClose={() => setSelected(null)}
          onSaveNotes={(n) => updateNotes(selected.id, n)}
          onStatus={(s) => updateStatus(selected.id, s)}
        />
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "font-body text-xs tracking-[0.12em] uppercase px-5 py-2.5 transition-colors " +
        (active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="border border-border bg-card p-6 flex items-center justify-between shadow-card-light">
      <div>
        <div className="overline-label mb-1">{label}</div>
        <div className="font-display text-4xl font-light text-foreground">{value}</div>
      </div>
      <Icon className="h-5 w-5 text-gold" />
    </div>
  );
}

function StatusBadge({ status, onChange }: { status: LeadStatus; onChange?: (s: LeadStatus) => void }) {
  const color = STATUS_COLORS[status];
  const label = STATUSES.find((x) => x.v === status)?.label ?? status;
  if (!onChange) {
    return (
      <span className="inline-flex items-center gap-1.5 font-body text-xs" style={{ color }}>
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        {label}
      </span>
    );
  }
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      onClick={(e) => e.stopPropagation()}
      className="border border-border bg-background px-2 py-1 font-body text-xs text-foreground"
    >
      {STATUSES.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}
    </select>
  );
}

function BrandsTable({ rows, onSelect, onStatus }: { rows: Brand[]; onSelect: (r: Brand) => void; onStatus: (id: string, s: LeadStatus) => void }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-accent/30 border-b border-border">
          <tr>
            <Th>Brand</Th><Th>Contact</Th><Th>Email</Th><Th>Niche</Th><Th>Budget</Th><Th>Status</Th><Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} onClick={() => onSelect(b)} className="border-b border-border hover:bg-accent/20 cursor-pointer transition-colors">
              <Td>
                <div className="font-body text-sm font-medium text-foreground">{b.brand_name}</div>
                {b.instagram_handle && <div className="font-body text-xs text-muted-foreground">{b.instagram_handle}</div>}
              </Td>
              <Td>{b.contact_person}</Td>
              <Td className="text-muted-foreground">{b.email}</Td>
              <Td>{b.niche || "—"}</Td>
              <Td>{b.budget_range || "—"}</Td>
              <Td><StatusBadge status={b.status} onChange={(s) => onStatus(b.id, s)} /></Td>
              <Td className="text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CreatorsTable({ rows, onSelect, onStatus }: { rows: Creator[]; onSelect: (r: Creator) => void; onStatus: (id: string, s: LeadStatus) => void }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-accent/30 border-b border-border">
          <tr>
            <Th>Creator</Th><Th>Email</Th><Th>Niche</Th><Th>Followers</Th><Th>Platforms</Th><Th>Status</Th><Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} onClick={() => onSelect(c)} className="border-b border-border hover:bg-accent/20 cursor-pointer transition-colors">
              <Td>
                <div className="font-body text-sm font-medium text-foreground">{c.full_name}</div>
                <div className="font-body text-xs text-muted-foreground">{c.instagram_handle}</div>
              </Td>
              <Td className="text-muted-foreground">{c.email}</Td>
              <Td>{c.niche || "—"}</Td>
              <Td>{c.followers_count || "—"}</Td>
              <Td className="text-xs text-muted-foreground">{c.platforms?.join(", ") || "—"}</Td>
              <Td><StatusBadge status={c.status} onChange={(s) => onStatus(c.id, s)} /></Td>
              <Td className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left overline-label">{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={"px-4 py-3 align-top font-body text-sm " + className}>{children}</td>
);

function Empty() {
  return (
    <div className="p-16 text-center">
      <p className="font-display text-xl font-light text-muted-foreground">No leads yet</p>
      <p className="font-body text-sm text-muted-foreground/60 mt-2">Submissions from the landing page will appear here.</p>
    </div>
  );
}

function DetailDrawer({ lead, kind, onClose, onSaveNotes, onStatus }: {
  lead: Brand | Creator; kind: "brands" | "creators"; onClose: () => void; onSaveNotes: (n: string) => void; onStatus: (s: LeadStatus) => void;
}) {
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  useEffect(() => setNotes(lead.admin_notes ?? ""), [lead]);
  const isBrand = kind === "brands";
  const b = lead as Brand;
  const c = lead as Creator;
  const igHandle = (isBrand ? b.instagram_handle : c.instagram_handle)?.replace(/^@/, "");

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-y-auto bg-background border-l border-border p-8 shadow-luxury animate-slide-up"
      >
        <button onClick={onClose} className="absolute top-6 right-6 overline-label text-muted-foreground hover:text-foreground transition-colors">
          Close ✕
        </button>

        <span className="overline-label mb-3 block">{isBrand ? "Brand Brief" : "Creator Profile"}</span>
        <h2 className="font-display text-3xl font-light text-foreground">{isBrand ? b.brand_name : c.full_name}</h2>
        <div className="mt-4"><StatusBadge status={lead.status} onChange={onStatus} /></div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={`mailto:${isBrand ? b.email : c.email}`}
            className="font-body text-xs tracking-[0.15em] uppercase border border-foreground bg-foreground text-background px-4 py-2 hover:bg-transparent hover:text-foreground transition-all flex items-center gap-1.5"
          >
            <Mail className="h-3 w-3" /> Send email
          </a>
          {igHandle && (
            <a
              href={`https://instagram.com/${igHandle}`}
              target="_blank"
              rel="noreferrer"
              className="font-body text-xs tracking-[0.15em] uppercase border border-border px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-all flex items-center gap-1.5"
            >
              <Instagram className="h-3 w-3" /> @{igHandle}
            </a>
          )}
        </div>

        <dl className="mt-8 space-y-4 border-t border-border pt-6">
          {isBrand ? (
            <>
              <Detail k="Contact" v={b.contact_person} />
              <Detail k="Email" v={b.email} />
              <Detail k="Website" v={b.website} />
              <Detail k="Niche" v={b.niche} />
              <Detail k="Budget" v={b.budget_range} />
              <Detail k="Creators needed" v={b.creators_needed} />
              <Detail k="Deliverables" v={b.deliverables} />
              <Detail k="Campaign goal" v={b.campaign_goal} />
              <Detail k="Notes from brand" v={b.notes} />
            </>
          ) : (
            <>
              <Detail k="Email" v={c.email} />
              <Detail k="Phone" v={c.phone} />
              <Detail k="Location" v={c.location} />
              <Detail k="Niche" v={c.niche} />
              <Detail k="Followers" v={c.followers_count} />
              <Detail k="Engagement rate" v={c.engagement_rate} />
              <Detail k="Platforms" v={c.platforms?.join(", ")} />
              <Detail k="Content type" v={c.content_type} />
              <Detail k="Portfolio" v={c.portfolio_links} />
              <Detail k="Past collaborations" v={c.past_collaborations} />
              <Detail k="Media kit" v={c.media_kit_url} />
            </>
          )}
        </dl>

        <div className="mt-8 border-t border-border pt-6">
          <Label className="overline-label mb-3 block">Internal notes</Label>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-background text-sm" />
          <button
            onClick={() => onSaveNotes(notes)}
            className="mt-4 font-body text-xs tracking-[0.15em] uppercase border border-foreground bg-foreground text-background px-5 py-2.5 hover:bg-transparent hover:text-foreground transition-all"
          >
            Save notes
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div>
      <dt className="overline-label mb-0.5">{k}</dt>
      <dd className="font-body text-sm text-foreground break-words">{v}</dd>
    </div>
  );
}
