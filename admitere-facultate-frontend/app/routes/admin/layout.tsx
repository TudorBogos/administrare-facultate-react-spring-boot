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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="relative flex min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] h-64 w-64 -translate-x-1/2 bg-[#2f3d4b] opacity-35 blur-[110px]"
      />
      <aside
        className={[
          "sticky top-0 z-20 h-screen shrink-0 border-r border-[var(--stroke)] bg-[var(--header)] shadow-lg transition-all duration-300 ease-out",
          sidebarCollapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div
            className={[
              "flex items-start justify-between gap-3 pt-6",
              sidebarCollapsed ? "px-3" : "px-6",
            ].join(" ")}
          >
            <div className="space-y-1">
              <p className={sidebarCollapsed ? "label sr-only" : "label"}>
                Administrare
              </p>
              <h1
                className={
                  sidebarCollapsed ? "font-display sr-only" : "font-display text-2xl"
                }
              >
                Admitere la facultate
              </h1>
              <span
                aria-hidden
                className={
                  sidebarCollapsed
                    ? "text-xs font-semibold uppercase tracking-[0.25em] text-(--muted)"
                    : "hidden"
                }
              >
                ADM
              </span>
            </div>
            <button
              className={[
                "btn btn-ghost",
                sidebarCollapsed ? "px-2" : "px-3",
              ].join(" ")}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-expanded={!sidebarCollapsed}
              aria-label={sidebarCollapsed ? "Extinde meniul" : "Restrange meniul"}
            >
              <span className="sr-only">
                {sidebarCollapsed ? "Extinde" : "Restrange"}
              </span>
              <span
                aria-hidden
                className="text-xs font-semibold"
              >
                {sidebarCollapsed ? ">>" : "<<"}
              </span>
            </button>
          </div>
          <nav
            className={[
              "mt-6 flex flex-1 flex-col gap-1 pb-6",
              sidebarCollapsed ? "px-2" : "px-4",
            ].join(" ")}
          >
            {sections.map((section) => {
              const shortLabel = section.label.includes(" ")
                ? section.label
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : section.label.slice(0, 2).toUpperCase();
              return (
                <NavLink
                  key={section.to}
                  to={section.to}
                  title={section.label}
                  className={({ isActive }) =>
                    [
                      "flex items-center px-4 py-2 text-sm font-semibold transition",
                      sidebarCollapsed ? "justify-center" : "justify-between",
                      isActive
                        ? "bg-[var(--brand)] text-white shadow-sm"
                        : "text-[var(--ink)] hover:bg-white/10",
                    ].join(" ")
                  }
                >
                  <span className={sidebarCollapsed ? "sr-only" : ""}>
                    {section.label}
                  </span>
                  <span
                    aria-hidden
                    className={
                      sidebarCollapsed ? "text-xs font-semibold" : "hidden"
                    }
                  >
                    {shortLabel}
                  </span>
                </NavLink>
              );
            })}
          </nav>
          <div
            className={[
              "mt-auto space-y-3 border-t border-[var(--stroke)] pb-6 pt-4",
              sidebarCollapsed ? "px-2" : "px-4",
            ].join(" ")}
          >
            <button
              className={[
                "btn btn-primary w-full",
                sidebarCollapsed ? "justify-center px-2" : "",
              ].join(" ")}
              onClick={handleProcesareAdmitere}
              disabled={processing}
            >
              <span className={sidebarCollapsed ? "sr-only" : ""}>
                {processing ? "Se proceseaza..." : "Proceseaza admiterea"}
              </span>
              <span
                aria-hidden
                className={
                  sidebarCollapsed ? "text-[10px] font-semibold tracking-[0.18em]" : "hidden"
                }
              >
                PROC
              </span>
            </button>
            <span
              className={
                sidebarCollapsed
                  ? "sr-only"
                  : "block truncate text-xs text-(--muted)"
              }
            >
              {admin?.email}
            </span>
            <span
              aria-hidden
              className={
                sidebarCollapsed ? "text-[10px] font-semibold text-(--muted)" : "hidden"
              }
            >
              ADMIN
            </span>
            <button
              className={[
                "btn btn-ghost w-full",
                sidebarCollapsed ? "justify-center px-2" : "",
              ].join(" ")}
              onClick={handleLogout}
            >
              <span className={sidebarCollapsed ? "sr-only" : ""}>
                Deconectare
              </span>
              <span
                aria-hidden
                className={
                  sidebarCollapsed ? "text-[10px] font-semibold tracking-[0.18em]" : "hidden"
                }
              >
                IESI
              </span>
            </button>
          </div>
        </div>
      </aside>
      <main className="mx-auto flex w-full flex-1 flex-col gap-6 px-6 py-10">
        <ErrorBanner message={error} />
        <ErrorBanner message={processError} />
        {processMessage ? (
          <p className="border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-100">
            {processMessage}
          </p>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}
