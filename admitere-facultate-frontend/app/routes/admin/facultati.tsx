import { useEffect, useState, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { Facultate } from "~/lib/types";

const emptyForm = { nume: "" };

export default function FacultatiPage() {
  const [items, setItems] = useState<Facultate[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await api<Facultate[]>("/api/admin/facultati");
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
    const payload = { nume: form.nume.trim() };
    if (!payload.nume) {
      setError("Introdu un nume pentru facultate.");
      return;
    }
    try {
      if (editingId) {
        await api<Facultate>(`/api/admin/facultati/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<Facultate>("/api/admin/facultati", {
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

  const startEdit = (item: Facultate) => {
    setForm({ nume: item.nume });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await api<void>(`/api/admin/facultati/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergere esuata.");
    }
  };

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Facultati'
        description='Administrare liste de facultati si denumiri unice.'
      />

      <div className='grid gap-6 lg:grid-cols-[1fr_5fr] items-start'>
        <Card className='p-6'>
          <h3 className='font-display text-xl'>
            {editingId ? "Editeaza facultate" : "Adauga facultate"}
          </h3>
          <form
            className='mt-5 space-y-4'
            onSubmit={handleSubmit}>
            <FormField
              label='Nume'
              htmlFor='nume-facultate'>
              <input
                id='nume-facultate'
                className='input'
                value={form.nume}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nume: event.target.value }))
                }
                placeholder='Ex: Facultatea de Informatica'
                required
              />
            </FormField>
            <ErrorBanner message={error} />
            <div className='flex flex-wrap gap-3'>
              <button
                className='btn btn-primary'
                type='submit'>
                {editingId ? "Salveaza modificari" : "Adauga facultate"}
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
            title='Lista facultati'
            meta={<span className='pill'>{items.length} inregistrari</span>}
          />
          <div className='mt-4 overflow-x-auto'>
            <Table>
              <TableHead>
                <tr>
                  <th className='pb-3'>ID</th>
                  <th className='pb-3'>Nume</th>
                  <th className='pb-3'>Actiuni</th>
                </tr>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className='py-3 font-semibold'>{item.id}</td>
                    <td className='py-3'>{item.nume}</td>
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
                      colSpan={3}>
                      Nu exista facultati inregistrate.
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
