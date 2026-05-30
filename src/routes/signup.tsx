import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Daftar — elle.nailroom" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Akun berhasil dibuat!");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <main className="min-h-screen flex flex-col px-6 py-10" style={{ background: "var(--gradient-soft)" }}>
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="mb-10 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-5 text-2xl font-semibold">Buat akun</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mulai kelola invoice nail art Anda</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
            {loading ? "Membuat..." : "Daftar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-medium text-primary">Masuk</Link>
        </p>
      </div>
    </main>
  );
}
