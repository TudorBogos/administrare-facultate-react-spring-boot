import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Card } from "~/components/Card";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { api } from "~/lib/api";
import type { Admin } from "~/lib/types";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        await api<Admin>("/api/auth/me");
        if (active) {
          navigate("/admin/facultati", { replace: true });
        }
      } catch {
        // No active session, keep login form.
      }
    };
    void checkSession();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api<Admin>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, parola }),
      });
      navigate("/admin/facultati");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Autentificare esuata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='relative min-h-screen overflow-hidden'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 bg-[#2a3b4d] opacity-45 blur-[120px]'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] bg-[#44362c] opacity-40 blur-[140px]'
      />
      <div className='relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16'>
        <div className='grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
          <div className='space-y-1'>
            <h1 className='font-display text-4xl leading-tight sm:text-5xl'>
              Admitere la facultate
            </h1>
            <p className='text-base text-(--muted) sm:text-lg'>
              Autentifica-te pentru a gestiona facultatile, programele si
              dosarele candidatilor.
            </p>
          </div>
          <Card className='p-8'>
            <h2 className='font-display text-2xl'>Autentificare admin</h2>
            <p className='mt-2 text-sm text-(--muted)'>
              Foloseste datele de acces create in tabelul de administratori.
            </p>
            <form
              className='mt-6 space-y-4'
              onSubmit={handleSubmit}>
              <FormField
                label='Email'
                htmlFor='email'>
                <input
                  id='email'
                  className='input'
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder='admin@facultate.ro'
                  required
                />
              </FormField>
              <FormField
                label='Parola'
                htmlFor='parola'>
                <input
                  id='parola'
                  className='input'
                  type='password'
                  value={parola}
                  onChange={(event) => setParola(event.target.value)}
                  placeholder='********'
                  required
                />
              </FormField>
              <ErrorBanner message={error} />
              <button
                className='btn btn-primary w-full'
                disabled={loading}>
                {loading ? "Se autentifica..." : "Intra in dashboard"}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
