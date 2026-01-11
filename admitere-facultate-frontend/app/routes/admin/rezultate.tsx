import { Fragment, useEffect, useState } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { RezultatAdmitere } from "~/lib/types";

export default function RezultateAdmiterePage() {
  const [items, setItems] = useState<RezultatAdmitere[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await api<RezultatAdmitere[]>("/api/admin/rezultate");
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot incarca rezultatele.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const formatMedie = (medie: number | null) => {
    if (medie === null) {
      return "-";
    }
    return medie.toFixed(2);
  };

  const groupedEntries = Object.entries(
    items.reduce<Record<string, RezultatAdmitere[]>>((acc, item) => {
      const key = item.facultateNume ?? "Fara facultate";
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    }, {})
  ).sort(([a], [b]) => a.localeCompare(b, "ro"));
  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Rezultate admitere'
        description='Aplicatii validate si procesate, cu rezultat pentru fiecare dosar.'
      />

      <Card className='p-6'>
        <CardHeader
          title='Aplicatii procesate'
          meta={<span className='pill'>{items.length} inregistrari</span>}
        />
        <div className='mt-4 overflow-x-auto'>
          <Table>
            <TableHead>
              <tr>
                <th className='pb-3'>Dosar</th>
                <th className='pb-3'>Candidat</th>
                <th className='pb-3'>Medie</th>
                <th className='pb-3'>Program</th>
                <th className='pb-3'>Facultate</th>
                <th className='pb-3'>Status</th>
              </tr>
            </TableHead>
            <TableBody>
              {groupedEntries.map(([facultate, entries]) => (
                <Fragment key={facultate}>
                  <tr>
                    <td
                      className='py-2 text-xs uppercase tracking-[0.2em] text-(--muted)'
                      colSpan={6}
                    >
                      {facultate}
                    </td>
                  </tr>
                  {entries.map((item) => (
                    <tr
                      key={`${item.dosarId}-${item.programId}-${item.prioritate}`}
                    >
                      <td className='py-3 font-semibold'>{item.dosarId}</td>
                      <td className='py-3'>
                        {item.candidatNume} {item.candidatPrenume}
                      </td>
                      <td className='py-3'>{formatMedie(item.medie)}</td>
                      <td className='py-3'>{item.programNume ?? "-"}</td>
                      <td className='py-3'>{item.facultateNume ?? "-"}</td>
                      <td className='py-3'>{item.status}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td
                    className='py-6 text-sm text-(--muted)'
                    colSpan={6}>
                    Nu exista rezultate procesate.
                  </td>
                </tr>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <ErrorBanner className='mt-4' message={error} />
      </Card>
    </section>
  );
}
