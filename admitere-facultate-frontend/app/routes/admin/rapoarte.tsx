import { useEffect, useState, useMemo, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { RaportFacultate, RaportInscrieriProgram } from "~/lib/types";

const emptyFilters = {
  start: "",
  end: "",
};

export default function RapoartePage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [programReport, setProgramReport] = useState<RaportInscrieriProgram[]>(
    []
  );
  const [facultateReport, setFacultateReport] = useState<RaportFacultate[]>([]);
  const [error, setError] = useState("");

  const buildQuery = (nextFilters: typeof emptyFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.start) {
      params.set("start", nextFilters.start);
    }
    if (nextFilters.end) {
      params.set("end", nextFilters.end);
    }
    const text = params.toString();
    return text ? `?${text}` : "";
  };

  const load = async (nextFilters: typeof emptyFilters = filters) => {
    setError("");
    try {
      const query = buildQuery(nextFilters);
      const [programs, faculties] = await Promise.all([
        api<RaportInscrieriProgram[]>(
          `/api/admin/rapoarte/inscrieri-program${query}`
        ),
        api<RaportFacultate[]>(
          `/api/admin/rapoarte/rezultate-facultati${query}`
        ),
      ]);
      setProgramReport(programs);
      setFacultateReport(faculties);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nu pot incarca rapoartele."
      );
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await load(filters);
  };

  const handleReset = async () => {
    setFilters(emptyFilters);
    await load(emptyFilters);
  };

  const handleExport = (type: "csv" | "pdf") => {
    const url = `/api/admin/rapoarte/inscrieri-program.${type}${buildQuery(filters)}`;
    window.location.assign(url);
  };

  const sortedFacultateReport = useMemo(() => {
    return [...facultateReport].sort((left, right) =>
      left.facultateNume.localeCompare(right.facultateNume, "ro", {
        sensitivity: "base",
      })
    );
  }, [facultateReport]);

  const maxBar = useMemo(() => {
    const max = sortedFacultateReport.reduce(
      (acc, item) => Math.max(acc, item.admisi, item.respinsi),
      0
    );
    return Math.max(max, 1);
  }, [sortedFacultateReport]);

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Rapoarte'
        description='Rezultatele reflecta ultima procesare de admitere.'
      />

      <Card className='p-6'>
        <CardHeader title='Perioada raportare' />
        <form
          className='mt-4 grid gap-4 md:grid-cols-4'
          onSubmit={handleSubmit}>
          <FormField
            label='Data start'
            htmlFor='raport-start'>
            <input
              id='raport-start'
              className='input'
              type='date'
              value={filters.start}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, start: event.target.value }))
              }
            />
          </FormField>
          <FormField
            label='Data final'
            htmlFor='raport-end'>
            <input
              id='raport-end'
              className='input'
              type='date'
              value={filters.end}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, end: event.target.value }))
              }
            />
          </FormField>
          <div className='flex flex-wrap items-end gap-3 md:col-span-2'>
            <button
              className='btn btn-primary'
              type='submit'>
              Aplica perioada
            </button>
            <button
              className='btn btn-ghost'
              type='button'
              onClick={handleReset}>
              Reseteaza
            </button>
          </div>
        </form>
        <ErrorBanner
          className='mt-3'
          message={error}
        />
      </Card>

      <Card className='p-6'>
        <CardHeader
          title='Inscrieri pe program'
          meta={<span className='pill'>{programReport.length} programe</span>}
        />
        <div className='mt-4 flex flex-wrap gap-3'>
          <button
            className='btn btn-ghost'
            type='button'
            onClick={() => handleExport("csv")}>
            Export CSV
          </button>
          <button
            className='btn btn-ghost'
            type='button'
            onClick={() => handleExport("pdf")}>
            Export PDF
          </button>
        </div>
        <div className='mt-4 overflow-x-auto'>
          <Table>
            <TableHead>
              <tr>
                <th className='pb-3'>ID</th>
                <th className='pb-3'>Program</th>
                <th className='pb-3'>Facultate</th>
                <th className='pb-3'>Inscrisi</th>
              </tr>
            </TableHead>
            <TableBody>
              {programReport.map((item) => (
                <tr key={item.programId}>
                  <td className='py-3 font-semibold'>{item.programId}</td>
                  <td className='py-3'>{item.programNume}</td>
                  <td className='py-3'>{item.facultateNume}</td>
                  <td className='py-3'>{item.inscrisi}</td>
                </tr>
              ))}
              {programReport.length === 0 ? (
                <tr>
                  <td
                    className='py-6 text-sm text-(--muted)'
                    colSpan={4}>
                    Nu exista rezultate procesate.
                  </td>
                </tr>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className='p-6'>
        <CardHeader title='Rezultate pe facultati' />
        <div className='mt-4 space-y-5'>
          {sortedFacultateReport.map((item) => (
            <div
              key={item.facultateNume}
              className='grid gap-3 md:grid-cols-[220px_1fr]'>
              <div className='text-sm font-semibold'>{item.facultateNume}</div>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <span className='w-16 text-xs text-(--muted)'>Admisi</span>
                  <div className='h-2 flex-1 bg-[var(--stroke)]'>
                    <div
                      className='h-2 bg-emerald-500'
                      style={{ width: `${(item.admisi / maxBar) * 100}%` }}
                    />
                  </div>
                  <span className='text-xs text-(--muted)'>{item.admisi}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='w-16 text-xs text-(--muted)'>Respinsi</span>
                  <div className='h-2 flex-1 bg-[var(--stroke)]'>
                    <div
                      className='h-2 bg-rose-500'
                      style={{ width: `${(item.respinsi / maxBar) * 100}%` }}
                    />
                  </div>
                  <span className='text-xs text-(--muted)'>
                    {item.respinsi}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {sortedFacultateReport.length === 0 ? (
            <p className='text-sm text-(--muted)'>
              Nu exista rezultate procesate.
            </p>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
