import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, LogOut, Search, Download, Building2, User as UserIcon, Mail, Instagram, Filter } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type LeadStatus = "new" | "contacted" | "in_progress" | "closed";

const STATUSES: { v: LeadStatus; label: string; color: string }[] = [
  { v: "new", label: "New", color: "oklch(0.72 0.22 340)" },
  { v: "contacted", label: "Contacted", color: "oklch(0.7 0.18 220)" },
  { v: "in_progress", label: "In Progress", color: "oklch(0.78 0.16 80)" },
  { v: "closed", label: "Closed", color: "oklch(0.55 0.05 280)" },
];

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
    // Probe admin by attempting a select on user_roles (admin-only RLS) — alt: check via has_role server side.
    // Simpler: try to read brands. If allowed, admin.
    supabase.from("brands").select("id").limit(1).then(({ error }) => {
      setIsAdmin(!error);
    });
  }, [session]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-pink" /></div>;
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
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-glow opacity-50 -z-10" />
      <form onSubmit={submit} className="glass-strong w-full max-w-md rounded-3xl p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-full bg-gradient-brand shadow-glow" />
          <span className="text-base font-semibold tracking-tight">Tribe Hunt</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Admin {mode === "signin" ? "sign in" : "sign up"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Access the leads dashboard.</p>
        <div className="mt-6 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={busy} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode((m) => m === "signin" ? "signup" : "signin")} className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

function NoAccessView({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-xl font-bold">No admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as <span className="text-foreground">{email}</span>, but this account isn't an admin yet.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          The agency owner needs to grant you the <code className="text-pink">admin</code> role in the backend (table <code className="text-pink">user_roles</code>).
        </p>
        <button onClick={() => supabase.auth.signOut()} className="mt-6 rounded-full border border-border px-4 py-2 text-sm">Sign out</button>
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
    new: [...brands, ...creators].filter((x) => x.status === "new").length,
  };

  return (
    <div className="relative min-h-screen">
      <header className="border-b border-border/60 backdrop-blur sticky top-0 z-30 bg-background/80">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-brand" />
            <span className="font-semibold">Tribe Hunt</span>
            <span className="ml-3 text-xs text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-muted-foreground">{email}</span>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-foreground/30">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Stat label="Brand leads" value={counts.brands} icon={Building2} />
          <Stat label="Creator leads" value={counts.creators} icon={UserIcon} />
          <Stat label="New (unread)" value={counts.new} icon={Filter} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-5">
          <div className="inline-flex glass rounded-full p-1">
            <TabBtn active={tab === "brands"} onClick={() => setTab("brands")}>Brands ({brands.length})</TabBtn>
            <TabBtn active={tab === "creators"} onClick={() => setTab("creators")}>Creators ({creators.length})</TabBtn>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-9 w-56" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
            <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs hover:border-foreground/30">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
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
    <button onClick={onClick} className={"rounded-full px-4 py-1.5 text-sm transition " + (active ? "bg-gradient-brand text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground")}>
      {children}
    </button>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-bold text-gradient">{value}</div>
      </div>
      <Icon className="h-6 w-6 text-pink" />
    </div>
  );
}

function StatusBadge({ status, onChange }: { status: LeadStatus; onChange?: (s: LeadStatus) => void }) {
  const s = STATUSES.find((x) => x.v === status) ?? STATUSES[0];
  if (!onChange) return <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs" style={{ color: s.color }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />{s.label}</span>;
  return (
    <select value={status} onChange={(e) => onChange(e.target.value as LeadStatus)} onClick={(e) => e.stopPropagation()}
      className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs">
      {STATUSES.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}
    </select>
  );
}

function BrandsTable({ rows, onSelect, onStatus }: { rows: Brand[]; onSelect: (r: Brand) => void; onStatus: (id: string, s: LeadStatus) => void }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
          <tr>
            <Th>Brand</Th><Th>Contact</Th><Th>Email</Th><Th>Niche</Th><Th>Budget</Th><Th>Status</Th><Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} onClick={() => onSelect(b)} className="border-b border-border/40 hover:bg-card/40 cursor-pointer">
              <Td>
                <div className="font-semibold">{b.brand_name}</div>
                {b.instagram_handle && <div className="text-xs text-muted-foreground">{b.instagram_handle}</div>}
              </Td>
              <Td>{b.contact_person}</Td>
              <Td className="text-muted-foreground">{b.email}</Td>
              <Td>{b.niche || "—"}</Td>
              <Td>{b.budget_range || "—"}</Td>
              <Td><StatusBadge status={b.status} onChange={(s) => onStatus(b.id, s)} /></Td>
              <Td className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</Td>
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
        <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
          <tr>
            <Th>Creator</Th><Th>Email</Th><Th>Niche</Th><Th>Followers</Th><Th>Platforms</Th><Th>Status</Th><Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} onClick={() => onSelect(c)} className="border-b border-border/40 hover:bg-card/40 cursor-pointer">
              <Td>
                <div className="font-semibold">{c.full_name}</div>
                <div className="text-xs text-muted-foreground">{c.instagram_handle}</div>
              </Td>
              <Td className="text-muted-foreground">{c.email}</Td>
              <Td>{c.niche || "—"}</Td>
              <Td>{c.followers_count || "—"}</Td>
              <Td className="text-xs">{c.platforms?.join(", ") || "—"}</Td>
              <Td><StatusBadge status={c.status} onChange={(s) => onStatus(c.id, s)} /></Td>
              <Td className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => <th className="px-4 py-3 text-left font-medium">{children}</th>;
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <td className={"px-4 py-3 align-top " + className}>{children}</td>;

function Empty() {
  return <div className="p-12 text-center text-sm text-muted-foreground">No leads yet — submissions from the landing page will appear here.</div>;
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
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg overflow-y-auto bg-card border-l border-border p-6 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground">Close ✕</button>
        <div className="text-xs font-mono uppercase tracking-widest text-pink mb-2">{isBrand ? "Brand" : "Creator"}</div>
        <h2 className="text-2xl font-bold tracking-tight">{isBrand ? b.brand_name : c.full_name}</h2>
        <div className="mt-3"><StatusBadge status={lead.status} onChange={onStatus} /></div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a href={`mailto:${isBrand ? b.email : c.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground">
            <Mail className="h-3.5 w-3.5" /> Email
          </a>
          {igHandle && (
            <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs">
              <Instagram className="h-3.5 w-3.5" /> @{igHandle}
            </a>
          )}
        </div>

        <dl className="mt-6 space-y-3 text-sm">
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
              <Detail k="Engagement" v={c.engagement_rate} />
              <Detail k="Platforms" v={c.platforms?.join(", ")} />
              <Detail k="Content type" v={c.content_type} />
              <Detail k="Portfolio" v={c.portfolio_links} />
              <Detail k="Past collabs" v={c.past_collaborations} />
              <Detail k="Media kit" v={c.media_kit_url} />
            </>
          )}
        </dl>

        <div className="mt-6">
          <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Internal notes</Label>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button onClick={() => onSaveNotes(notes)} className="mt-3 rounded-full bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground">Save notes</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="text-foreground break-words">{v}</dd>
    </div>
  );
}
