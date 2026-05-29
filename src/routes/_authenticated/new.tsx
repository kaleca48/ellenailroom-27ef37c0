import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NAIL_SERVICES, formatIDR } from "@/lib/services";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/new")({
  head: () => ({ meta: [{ title: "Invoice baru — Nail Atelier" }] }),
  component: NewInvoice,
});

interface SelectedItem { name: string; price: number; quantity: number; }

function NewInvoice() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const total = Math.max(0, subtotal - discount + tax);

  const toggle = (name: string, price: number) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.name === name);
      if (exists) return prev.filter((i) => i.name !== name);
      return [...prev, { name, price, quantity: 1 }];
    });
  };

  const setQty = (name: string, delta: number) => {
    setItems((prev) => prev.map((i) => i.name === name ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const save = async () => {
    if (!customerName.trim()) return toast.error("Nama customer wajib diisi");
    if (items.length === 0) return toast.error("Pilih minimal satu layanan");

    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user!.id;
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    const { data: inv, error } = await supabase
      .from("invoices")
      .insert({
        user_id: userId,
        invoice_number: invoiceNumber,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || null,
        invoice_date: date,
        subtotal, discount, tax, total,
        notes: notes.trim() || null,
      })
      .select("id")
      .single();

    if (error || !inv) { setSaving(false); return toast.error(error?.message ?? "Gagal menyimpan"); }

    const { error: itemsErr } = await supabase.from("invoice_items").insert(
      items.map((i) => ({ invoice_id: inv.id, service_name: i.name, price: i.price, quantity: i.quantity })),
    );
    setSaving(false);
    if (itemsErr) return toast.error(itemsErr.message);

    toast.success("Invoice tersimpan");
    navigate({ to: "/invoice/$id", params: { id: inv.id } });
  };

  return (
    <main className="min-h-screen pb-32" style={{ background: "var(--gradient-soft)" }}>
      <header className="px-6 pt-10 pb-4 flex items-center gap-3">
        <Link to="/dashboard" className="h-10 w-10 rounded-full bg-card inline-flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-semibold">Invoice baru</h1>
      </header>

      <div className="px-6 space-y-5">
        <section className="rounded-3xl bg-card p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Customer</h2>
          <div className="space-y-2">
            <Label htmlFor="cn">Nama</Label>
            <Input id="cn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nama customer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp">No. telepon (opsional)</Label>
            <Input id="cp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="0812..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="d">Tanggal</Label>
            <Input id="d" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </section>

        <section className="rounded-3xl bg-card p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Layanan</h2>
          <ul className="space-y-2">
            {NAIL_SERVICES.map((s) => {
              const sel = items.find((i) => i.name === s.name);
              return (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => toggle(s.name, s.price)}
                    className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition border ${sel ? "bg-accent border-primary/40" : "bg-secondary/40 border-transparent"}`}
                  >
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatIDR(s.price)}</p>
                    </div>
                    <span className={`h-6 w-6 rounded-full inline-flex items-center justify-center ${sel ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                      {sel && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {sel && (
                    <div className="flex items-center justify-end gap-3 mt-2 pr-2">
                      <button type="button" onClick={() => setQty(s.name, -1)} className="h-8 w-8 rounded-full bg-secondary inline-flex items-center justify-center">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{sel.quantity}</span>
                      <button type="button" onClick={() => setQty(s.name, 1)} className="h-8 w-8 rounded-full bg-secondary inline-flex items-center justify-center">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-3xl bg-card p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Diskon & pajak</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="disc">Diskon (Rp)</Label>
              <Input id="disc" type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Pajak (Rp)</Label>
              <Input id="tax" type="number" min={0} value={tax} onChange={(e) => setTax(Number(e.target.value) || 0)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (opsional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Pesan untuk customer..." />
          </div>
        </section>

        <section className="rounded-3xl bg-card p-5 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatIDR(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Diskon</span><span>- {formatIDR(discount)}</span></div>}
          {tax > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pajak</span><span>{formatIDR(tax)}</span></div>}
          <div className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total</span><span>{formatIDR(total)}</span></div>
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur border-t border-border">
        <Button onClick={save} disabled={saving} className="w-full rounded-full h-12 max-w-sm mx-auto flex">
          {saving ? "Menyimpan..." : `Simpan invoice · ${formatIDR(total)}`}
        </Button>
      </div>
    </main>
  );
}
