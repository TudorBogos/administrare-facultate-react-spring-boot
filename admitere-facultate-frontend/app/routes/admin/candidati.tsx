import { useEffect, useState, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { Candidat } from "~/lib/types";

const emptyForm = {
  nume: "",
  prenume: "",
  email: "",
  parola: "",
};

const emptyFilters = {
  nume: "",
  prenume: "",
  email: "",
};

export default function CandidatiPage() {
  const [items, setItems] = useState<Candidat[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const buildQuery = (nextFilters: typeof emptyFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.nume.trim()) {
      params.set("nume", nextFilters.nume.trim());
    }
    if (nextFilters.prenume.trim()) {
      params.set("prenume", nextFilters.prenume.trim());
    }
    if (nextFilters.email.trim()) {
      params.set("email", nextFilters.email.trim());
    }
    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const load = async (nextFilters: typeof emptyFilters = filters) => {
    setError("");
    try {
      const query = buildQuery(nextFilters);
      const data = await api<Candidat[]>(`/api/admin/candidati${query}`);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot incarca datele.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const nume = form.nume.trim();
    const prenume = form.prenume.trim();
    const email = form.email.trim();
    const parola = form.parola.trim();

    if (!nume || !prenume || !email) {
      setError("Completeaza nume, prenume si email.");
      return;
    }

    const payload = { nume, prenume, email, parola: parola || null };

    try {
      if (editingId) {
        await api<Candidat>(`/api/admin/candidati/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<Candidat>("/api/admin/candidati", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operatiune esuata.");
    }
  };

  const handleFilterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await load(filters);
  };

  const resetFilters = async () => {
    setFilters(emptyFilters);
    await load(emptyFilters);
  };

  const startEdit = (item: Candidat) => {
    setForm({
      nume: item.nume,
      prenume: item.prenume,
      email: item.email,
      parola: "",
    });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await api<void>(`/api/admin/candidati/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergere esuata.");
    }
  };

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Candidati'
        description='Gestionare candidati si filtre pe nume, prenume si email.'
      />

      <Card className='p-6'>
        <CardHeader title='Filtrare rapida' />
        <form
          className='mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1.2fr_auto_auto]'
          onSubmit={handleFilterSubmit}>
          <input
            className='input'
            placeholder='Nume'
            value={filters.nume}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, nume: event.target.value }))
            }
          />
          <input
            className='input'
            placeholder='Prenume'
            value={filters.prenume}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, prenume: event.target.value }))
            }
          />
          <input
            className='input'
            placeholder='Email'
            value={filters.email}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <button
            className='btn btn-primary'
            type='submit'>
            Cauta
          </button>
          <button
            className='btn btn-ghost'
            type='button'
            onClick={resetFilters}>
            Reseteaza
          </button>
        </form>
      </Card>

      <div className='grid gap-6 lg:grid-cols-[1fr_5fr] items-start'>
        <Card className='p-6'>
          <h3 className='font-display text-xl'>
            {editingId ? "Editeaza candidat" : "Adauga candidat"}
          </h3>
          <form
            className='mt-5 space-y-4'
            onSubmit={handleSubmit}>
            <FormField
              label='Nume'
              htmlFor='nume-candidat'>
              <input
                id='nume-candidat'
                className='input'
                value={form.nume}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nume: event.target.value }))
                }
                placeholder='Ex: Popescu'
                required
              />
            </FormField>
            <FormField
              label='Prenume'
              htmlFor='prenume-candidat'>
              <input
                id='prenume-candidat'
                className='input'
                value={form.prenume}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, prenume: event.target.value }))
                }
                placeholder='Ex: Andrei'
                required
              />
            </FormField>
            <FormField
              label='Email'
              htmlFor='email-candidat'>
              <input
                id='email-candidat'
                className='input'
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder='Ex: andrei@exemplu.ro'
                required
              />
            </FormField>
            <FormField
              label='Parola (se salveaza hash)'
              htmlFor='parola-candidat'>
              <input
                id='parola-candidat'
                className='input'
                value={form.parola}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, parola: event.target.value }))
                }
                placeholder='Optional'
                type='password'
              />
            </FormField>
            <ErrorBanner message={error} />
            <div className='flex flex-wrap gap-3'>
              <button
                className='btn btn-primary'
                type='submit'>
                {editingId ? "Salveaza modificari" : "Adauga candidat"}
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
            title='Lista candidati'
            meta={<span className='pill'>{items.length} rezultate</span>}
          />
          <div className='mt-4 overflow-x-auto'>
            <Table>
              <TableHead>
                <tr>
                  <th className='pb-3'>ID</th>
                  <th className='pb-3'>Nume</th>
                  <th className='pb-3'>Prenume</th>
                  <th className='pb-3'>Email</th>
                  <th className='pb-3 text-right'>Actiuni</th>
                </tr>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className='py-3 font-semibold'>{item.id}</td>
                    <td className='py-3'>{item.nume}</td>
                    <td className='py-3'>{item.prenume}</td>
                    <td className='py-3'>{item.email}</td>
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
                      colSpan={5}>
                      Nu exista candidati inregistrati.
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
