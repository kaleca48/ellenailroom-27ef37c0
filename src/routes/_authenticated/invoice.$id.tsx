import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { formatIDR } from "@/lib/services";
import { generateInvoicePDF } from "@/lib/pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/invoice/$id")({
  head: () => ({ meta: [{ title: "Detail invoice — Nail Atelier" }] }),
  component: InvoiceDetail,
});

function InvoiceDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const [{ data: inv, error: e1 }, { data: items, error: e2 }] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", id).single(),
        supabase.from("invoice_items").select("*").eq("invoice_id", id).order("created_at"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { invoice: inv, items: items ?? [] };
    },
  });

  const onDownload = () => {
    if (!data) return;
    generateInvoicePDF({
      invoice_number: data.invoice.invoice_number,
      customer_name: data.invoice.customer_name,
      customer_phone: data.invoice.customer_phone,
      invoice_date: data.invoice.invoice_date,
      items: data.items.map((i) => ({ service_name: i.service_name, price: Number(i.price), quantity: i.quantity })),
      subtotal: Number(data.invoice.subtotal),
      discount: Number(data.invoice.discount),
      tax: Number(data.invoice.tax),
      total: Number(data.invoice.total),
      notes: data.invoice.notes,
    });
  };

  const onDelete = async () => {
    if (!confirm("Hapus invoice ini?")) return;
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Invoice dihapus");
    navigate({ to: "/dashboard", replace: true });
  };

  if (isLoading || !data) {
    return <main className="min-h-screen p-6" style={{ background: "var(--gradient-soft)" }}><p className="text-sm text-muted-foreground">Memuat...</p></main>;
  }

  const { invoice, items } = data;

  return (
    <main className="min-h-screen pb-32" style={{ background: "var(--gradient-soft)" }}>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <Link to="/dashboard" className="h-10 w-10 rounded-full bg-card inline-flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button onClick={onDelete} className="h-10 w-10 rounded-full bg-card inline-flex items-center justify-center text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </header>

      <div className="px-6">
        <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Invoice</p>
              <p className="font-semibold mt-1">{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Tanggal</p>
              <p className="text-sm mt-1">{new Date(invoice.invoice_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Customer</p>
            <p className="font-semibold mt-1">{invoice.customer_name}</p>
            {invoice.customer_phone && <p className="text-sm text-muted-foreground">{invoice.customer_phone}</p>}
          </div>

          <div className="mt-6 border-t border-border pt-4 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <div>
                  <p>{it.service_name}</p>
                  <p className="text-xs text-muted-foreground">{it.quantity} × {formatIDR(Number(it.price))}</p>
                </div>
                <p className="font-medium">{formatIDR(Number(it.price) * it.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatIDR(Number(invoice.subtotal))}</span></div>
            {Number(invoice.discount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Diskon</span><span>- {formatIDR(Number(invoice.discount))}</span></div>}
            {Number(invoice.tax) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Pajak</span><span>{formatIDR(Number(invoice.tax))}</span></div>}
            <div className="flex justify-between font-semibold pt-2 border-t border-border text-base"><span>Total</span><span>{formatIDR(Number(invoice.total))}</span></div>
          </div>

          {invoice.notes && (
            <div className="mt-6 rounded-2xl bg-secondary/50 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Catatan</p>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur border-t border-border">
        <Button onClick={onDownload} className="w-full rounded-full h-12 max-w-sm mx-auto flex items-center gap-2">
          <Download className="h-4 w-4" /> Unduh PDF
        </Button>
      </div>
    </main>
  );
}
