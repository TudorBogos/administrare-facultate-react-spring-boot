import { useEffect, useState, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { Facultate, ProgramStudiu, ProgramStudiuView } from "~/lib/types";

const emptyForm = {
  facultateId: "",
  facultateNume: "",
  nume: "",
  locuriBuget: "",
  locuriTaxa: "",
};

const emptyFilters = {
  bugetMin: "",
  bugetMax: "",
  taxaMin: "",
  taxaMax: "",
};

export default function ProgrameStudiuPage() {
  const [items, setItems] = useState<ProgramStudiuView[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [facultyError, setFacultyError] = useState("");
  const [facultati, setFacultati] = useState<Facultate[]>([]);
  const [showFacultati, setShowFacultati] = useState(false);
  const [loadingFacultati, setLoadingFacultati] = useState(false);

  const buildQuery = (nextFilters: typeof emptyFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.bugetMin.trim()) {
      params.set("locuriBugetMin", nextFilters.bugetMin.trim());
    }
    if (nextFilters.bugetMax.trim()) {
      params.set("locuriBugetMax", nextFilters.bugetMax.trim());
    }
    if (nextFilters.taxaMin.trim()) {
      params.set("locuriTaxaMin", nextFilters.taxaMin.trim());
    }
    if (nextFilters.taxaMax.trim()) {
      params.set("locuriTaxaMax", nextFilters.taxaMax.trim());
    }
    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const load = async (nextFilters: typeof emptyFilters = filters) => {
    setError("");
    try {
      const query = buildQuery(nextFilters);
      const data = await api<ProgramStudiuView[]>(
        `/api/admin/programe-studiu${query}`
      );
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot incarca datele.");
    }
  };

  const fetchFacultati = async (query: string) => {
    setFacultyError("");
    setLoadingFacultati(true);
    try {
      const trimmed = query.trim();
      const url = trimmed
        ? `/api/admin/facultati?q=${encodeURIComponent(trimmed)}`
        : "/api/admin/facultati";
      const data = await api<Facultate[]>(url);
      setFacultati(data);
    } catch (err) {
      setFacultyError(
        err instanceof Error ? err.message : "Nu pot incarca facultatile."
      );
    } finally {
      setLoadingFacultati(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!showFacultati) {
      return;
    }
    const handle = setTimeout(() => {
      void fetchFacultati(form.facultateNume);
    }, 200);
    return () => clearTimeout(handle);
  }, [form.facultateNume, showFacultati]);

  const parseNumber = (value: string, label: string) => {
    if (!value.trim()) {
      setError(`Campul ${label} este obligatoriu.`);
      return null;
    }
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      setError(`Campul ${label} trebuie sa fie numeric.`);
      return null;
    }
    return numberValue;
  };

  const ensureNumericFilter = (value: string, label: string) => {
    if (!value.trim()) {
      return true;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setFilterError(`Campul ${label} trebuie sa fie numeric.`);
      return false;
    }
    return true;
  };

  const handleFilterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilterError("");

    if (
      !ensureNumericFilter(filters.bugetMin, "buget minim") ||
      !ensureNumericFilter(filters.bugetMax, "buget maxim") ||
      !ensureNumericFilter(filters.taxaMin, "taxa minima") ||
      !ensureNumericFilter(filters.taxaMax, "taxa maxima")
    ) {
      return;
    }

    if (
      filters.bugetMin.trim() &&
      filters.bugetMax.trim() &&
      Number(filters.bugetMin) > Number(filters.bugetMax)
    ) {
      setFilterError("Buget minim nu poate fi mai mare decat buget maxim.");
      return;
    }

    if (
      filters.taxaMin.trim() &&
      filters.taxaMax.trim() &&
      Number(filters.taxaMin) > Number(filters.taxaMax)
    ) {
      setFilterError("Taxa minima nu poate fi mai mare decat taxa maxima.");
      return;
    }

    await load(filters);
  };

  const resetFilters = async () => {
    setFilters(emptyFilters);
    setFilterError("");
    await load(emptyFilters);
  };

  const handleFacultateInput = (value: string) => {
    setForm((prev) => ({
      ...prev,
      facultateNume: value,
      facultateId: "",
    }));
    setShowFacultati(true);
  };

  const handleFacultateSelect = (facultate: Facultate) => {
    setForm((prev) => ({
      ...prev,
      facultateId: String(facultate.id),
      facultateNume: facultate.nume,
    }));
    setShowFacultati(false);
    setFacultyError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const facultateId = parseNumber(form.facultateId, "facultate");
    const locuriBuget = parseNumber(form.locuriBuget, "locuri buget");
    const locuriTaxa = parseNumber(form.locuriTaxa, "locuri taxa");
    const nume = form.nume.trim();

    if (!nume) {
      setError("Introdu numele programului.");
      return;
    }
    if (facultateId === null || locuriBuget === null || locuriTaxa === null) {
      return;
    }

    const payload = { facultateId, nume, locuriBuget, locuriTaxa };

    try {
      if (editingId) {
        await api<ProgramStudiu>(`/api/admin/programe-studiu/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<ProgramStudiu>("/api/admin/programe-studiu", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowFacultati(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operatiune esuata.");
    }
  };

  const startEdit = (item: ProgramStudiuView) => {
    setForm({
      facultateId: String(item.facultateId),
      facultateNume: item.facultateNume ?? "",
      nume: item.nume,
      locuriBuget: String(item.locuriBuget),
      locuriTaxa: String(item.locuriTaxa),
    });
    setEditingId(item.id);
    setShowFacultati(false);
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowFacultati(false);
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await api<void>(`/api/admin/programe-studiu/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergere esuata.");
    }
  };

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Programe de studiu'
        description='Administrare programe, locuri si asociere cu facultati.'
      />

      <Card className='p-6'>
        <CardHeader
          title='Filtrare locuri'
          meta={<span className='pill'>Buget / Taxa</span>}
        />
        <form
          className='mt-4 grid gap-4 md:grid-cols-4'
          onSubmit={handleFilterSubmit}>
          <FormField
            label='Buget minim'
            htmlFor='buget-min'>
            <input
              id='buget-min'
              className='input'
              type='number'
              value={filters.bugetMin}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  bugetMin: event.target.value,
                }))
              }
              placeholder='Ex: 50'
            />
          </FormField>
          <FormField
            label='Buget maxim'
            htmlFor='buget-max'>
            <input
              id='buget-max'
              className='input'
              type='number'
              value={filters.bugetMax}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  bugetMax: event.target.value,
                }))
              }
              placeholder='Ex: 200'
            />
          </FormField>
          <FormField
            label='Taxa minima'
            htmlFor='taxa-min'>
            <input
              id='taxa-min'
              className='input'
              type='number'
              value={filters.taxaMin}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, taxaMin: event.target.value }))
              }
              placeholder='Ex: 30'
            />
          </FormField>
          <FormField
            label='Taxa maxima'
            htmlFor='taxa-max'>
            <input
              id='taxa-max'
              className='input'
              type='number'
              value={filters.taxaMax}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, taxaMax: event.target.value }))
              }
              placeholder='Ex: 150'
            />
          </FormField>
          <div className='flex flex-wrap gap-3 md:col-span-4'>
            <button
              className='btn btn-primary'
              type='submit'>
              Filtreaza
            </button>
            <button
              className='btn btn-ghost'
              type='button'
              onClick={resetFilters}>
              Reseteaza
            </button>
          </div>
        </form>
        <ErrorBanner
          className='mt-3'
          message={filterError}
        />
      </Card>

      <div className='grid gap-6 lg:grid-cols-[1fr_5fr] items-start'>
        <Card className='p-6'>
          <h3 className='font-display text-xl'>
            {editingId ? "Editeaza program" : "Adauga program"}
          </h3>
          <form
            className='mt-5 space-y-4'
            onSubmit={handleSubmit}>
            <FormField
              label='Facultate'
              htmlFor='facultate-nume'>
              <div className='relative'>
                <input
                  id='facultate-nume'
                  className='input'
                  value={form.facultateNume}
                  onChange={(event) => handleFacultateInput(event.target.value)}
                  onFocus={() => setShowFacultati(true)}
                  onBlur={() => {
                    setTimeout(() => setShowFacultati(false), 150);
                  }}
                  placeholder='Cauta facultate...'
                  autoComplete='off'
                  required
                />
                {showFacultati ? (
                  <div className='absolute z-10 mt-2 w-full rounded-2xl border border-[--stroke] bg-white/95 p-2 shadow-sm'>
                    {loadingFacultati ? (
                      <div className='px-3 py-2 text-xs text-(--muted)'>
                        Se incarca...
                      </div>
                    ) : null}
                    {!loadingFacultati && facultati.length === 0 ? (
                      <div className='px-3 py-2 text-xs text-(--muted)'>
                        Nu exista rezultate.
                      </div>
                    ) : null}
                    {!loadingFacultati
                      ? facultati.map((facultate) => (
                          <button
                            key={facultate.id}
                            type='button'
                            className='w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f9f3ec]'
                            onMouseDown={() =>
                              handleFacultateSelect(facultate)
                            }>
                            {facultate.nume}
                          </button>
                        ))
                      : null}
                  </div>
                ) : null}
              </div>
            </FormField>
            <ErrorBanner message={facultyError} />
            <FormField
              label='Nume program'
              htmlFor='nume-program'>
              <input
                id='nume-program'
                className='input'
                value={form.nume}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nume: event.target.value }))
                }
                placeholder='Ex: Informatica'
                required
              />
            </FormField>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                label='Locuri buget'
                htmlFor='locuri-buget'>
                <input
                  id='locuri-buget'
                  className='input'
                  value={form.locuriBuget}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      locuriBuget: event.target.value,
                    }))
                  }
                  placeholder='Ex: 120'
                  required
                />
              </FormField>
              <FormField
                label='Locuri taxa'
                htmlFor='locuri-taxa'>
                <input
                  id='locuri-taxa'
                  className='input'
                  value={form.locuriTaxa}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      locuriTaxa: event.target.value,
                    }))
                  }
                  placeholder='Ex: 80'
                  required
                />
              </FormField>
            </div>
            <ErrorBanner message={error} />
            <div className='flex flex-wrap gap-3'>
              <button
                className='btn btn-primary'
                type='submit'>
                {editingId ? "Salveaza modificari" : "Adauga program"}
              </button>
              {editingId ? (
                <button
                  className='btn btn-ghost'
                  type='button'
                  onClick={cancelEdit}>
                  Renunta
                </button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card className='p-6'>
          <CardHeader
            title='Lista programe'
            meta={<span className='pill'>{items.length} inregistrari</span>}
          />
          <div className='mt-4 overflow-x-auto'>
            <Table>
              <TableHead>
                <tr>
                  <th className='pb-3'>ID</th>
                  <th className='pb-3'>Facultate</th>
                  <th className='pb-3'>Nume</th>
                  <th className='pb-3'>Buget</th>
                  <th className='pb-3'>Taxa</th>
                  <th className='pb-3'>Actiuni</th>
                </tr>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className='py-3 font-semibold'>{item.id}</td>
                    <td className='py-3'>{item.facultateNume}</td>
                    <td className='py-3'>{item.nume}</td>
                    <td className='py-3'>{item.locuriBuget}</td>
                    <td className='py-3'>{item.locuriTaxa}</td>
                    <td className='py-3 text-right'>
                      <div className='flex justify-end gap-2'>
                        <button
                          className='btn btn-ghost'
                          onClick={() => startEdit(item)}>
                          Editeaza
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => handleDelete(item.id)}>
                          Sterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td
                      className='py-6 text-sm text-(--muted)'
                      colSpan={6}>
                      Nu exista programe inregistrate.
                    </td>
                  </tr>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </section>
  );
}
