import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, FileText, Sparkles } from "lucide-react";
import { formatIDR } from "@/lib/services";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — elle.nailroom" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, customer_name, invoice_date, total")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  const totalRevenue = invoices?.reduce((s, i) => s + Number(i.total), 0) ?? 0;

  return (
    <main className="min-h-screen pb-28" style={{ background: "var(--gradient-soft)" }}>
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-none">elle.nailroom</h1>
            <p className="text-xs text-muted-foreground mt-1">Invoice studio</p>
          </div>
        </div>
        <button onClick={logout} className="h-10 w-10 rounded-full bg-card inline-flex items-center justify-center text-muted-foreground">
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <section className="px-6">
        <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total pendapatan</p>
          <p className="mt-2 text-3xl font-semibold font-[var(--font-display)]">{formatIDR(totalRevenue)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{invoices?.length ?? 0} invoice tercatat</p>
        </div>
      </section>

      <section className="px-6 mt-8">
        <h2 className="text-lg font-semibold mb-3">Riwayat invoice</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : !invoices || invoices.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada invoice. Buat invoice pertama Anda 💕</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  to="/invoice/$id"
                  params={{ id: inv.id }}
                  className="flex items-center justify-between rounded-2xl bg-card p-4 active:scale-[0.99] transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{inv.customer_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {inv.invoice_number} · {new Date(inv.invoice_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">{formatIDR(Number(inv.total))}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        to="/new"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 h-14 shadow-[var(--shadow-soft)] font-medium"
      >
        <Plus className="h-5 w-5" />
        Invoice baru
      </Link>
    </main>
  );
}
