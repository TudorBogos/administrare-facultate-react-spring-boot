import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { ErrorBanner } from "~/components/ErrorBanner";
import { api } from "~/lib/api";
import type { Admin, ProcesareAdmitereResult } from "~/lib/types";

const sections = [
  { to: "/admin/facultati", label: "Facultati" },
  { to: "/admin/programe-studiu", label: "Programe studiu" },
  { to: "/admin/candidati", label: "Candidati" },
  { to: "/admin/dosare", label: "Dosare" },
  { to: "/admin/optiuni", label: "Optiuni" },
  { to: "/admin/rezultate", label: "Rezultate" },
  { to: "/admin/rapoarte", label: "Rapoarte" },
  { to: "/admin/admini", label: "Administratori" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processError, setProcessError] = useState("");
  const [processMessage, setProcessMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const me = await api<Admin>("/api/auth/me");
        if (active) {
          setAdmin(me);
        }
      } catch {
        if (active) {
          navigate("/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!processMessage) {
      return;
    }
    const handle = setTimeout(() => {
      setProcessMessage("");
    }, 10000);
    return () => clearTimeout(handle);
  }, [processMessage]);

  const handleLogout = async () => {
    setError("");
    try {
      await api<void>("/api/auth/logout", { method: "POST" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la deconectare.");
    } finally {
      navigate("/login");
    }
  };

  const handleProcesareAdmitere = async () => {
    setProcessError("");
    setProcessMessage("");
    setProcessing(true);
    try {
      const result = await api<ProcesareAdmitereResult>("/api/admin/procesare", {
        method: "POST",
      });
      setProcessMessage(
        `Procesare finalizata: ${result.dosareProcesate} dosare, ${result.dosareAdmise} admisi, ${result.dosareNealocate} respinsi.`
      );
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : "Eroare la procesare.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-(--muted)">
        Se verifica sesiunea...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] h-64 w-64 -translate-x-1/2 rounded-full bg-[#f4b08b] opacity-40 blur-[100px]"
      />
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[rgba(249,243,236,0.9)] backdrop-blur">
        <div className="mx-auto flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="label">Administrare</p>
            <h1 className="font-display text-2xl">Admitere la facultate</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <NavLink
                key={section.to}
                to={section.to}
                className={({ isActive }) =>
                  [
                    "rounded-full px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-[var(--brand)] text-white shadow-sm"
                      : "text-[var(--ink)] hover:bg-white/70",
                  ].join(" ")
                }
              >
                {section.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              className="btn btn-primary"
              onClick={handleProcesareAdmitere}
              disabled={processing}
            >
              {processing ? "Se proceseaza..." : "Proceseaza admiterea"}
            </button>
            <span className="text-(--muted)">{admin?.email}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Deconectare
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full flex-1 flex-col gap-6 px-6 py-10">
        <ErrorBanner message={error} />
        <ErrorBanner message={processError} />
        {processMessage ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {processMessage}
          </p>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}
