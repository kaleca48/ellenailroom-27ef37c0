import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk — elle.nailroom" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <main className="min-h-screen flex flex-col px-6 py-10" style={{ background: "var(--gradient-soft)" }}>
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold">elle.nailroom</h1>
          <p className="mt-1 text-sm text-muted-foreground">Masuk untuk membuat invoice</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kamu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
            {loading ? "Masuk..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/signup" className="font-medium text-primary">Daftar</Link>
        </p>
      </div>
    </main>
  );
}
