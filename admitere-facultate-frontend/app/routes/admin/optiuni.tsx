import { useEffect, useState, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { Optiune } from "~/lib/types";

const emptyForm = {
  dosarId: "",
  programId: "",
  prioritate: "",
};

export default function OptiuniPage() {
  const [items, setItems] = useState<Optiune[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await api<Optiune[]>("/api/admin/optiuni");
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu pot incarca datele.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const parseRequiredNumber = (value: string, label: string) => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const dosarId = parseRequiredNumber(form.dosarId, "dosar ID");
    const programId = parseRequiredNumber(form.programId, "program ID");
    const prioritate = parseRequiredNumber(form.prioritate, "prioritate");
    if (dosarId === null || programId === null || prioritate === null) {
      return;
    }

    const payload = {
      dosarId,
      programId,
      prioritate,
    };

    try {
      if (editingId) {
        await api<Optiune>(`/api/admin/optiuni/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<Optiune>("/api/admin/optiuni", {
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

  const startEdit = (item: Optiune) => {
    setForm({
      dosarId: String(item.dosarId),
      programId: String(item.programId),
      prioritate: String(item.prioritate),
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
      await api<void>(`/api/admin/optiuni/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergere esuata.");
    }
  };

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Optiuni'
        description='Administrare optiuni si statusuri pentru dosare.'
      />

      <div className='grid gap-6 lg:grid-cols-[1fr_5fr] items-start'>
        <Card className='p-6'>
          <h3 className='font-display text-xl'>
            {editingId ? "Editeaza optiune" : "Adauga optiune"}
          </h3>
          <form
            className='mt-5 space-y-4'
            onSubmit={handleSubmit}>
            <FormField
              label='Dosar ID'
              htmlFor='dosar-id'>
              <input
                id='dosar-id'
                className='input'
                value={form.dosarId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dosarId: event.target.value }))
                }
                placeholder='Ex: 4'
                required
              />
            </FormField>
            <FormField
              label='Program ID'
              htmlFor='program-id'>
              <input
                id='program-id'
                className='input'
                value={form.programId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    programId: event.target.value,
                  }))
                }
                placeholder='Ex: 10'
                required
              />
            </FormField>
            <FormField
              label='Prioritate'
              htmlFor='prioritate'>
              <input
                id='prioritate'
                className='input'
                value={form.prioritate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    prioritate: event.target.value,
                  }))
                }
                placeholder='Ex: 1'
                required
              />
            </FormField>
            <ErrorBanner message={error} />
            <div className='flex flex-wrap gap-3'>
              <button
                className='btn btn-primary'
                type='submit'>
                {editingId ? "Salveaza modificari" : "Adauga optiune"}
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
            title='Lista optiuni'
            meta={<span className='pill'>{items.length} inregistrari</span>}
          />
          <div className='mt-4 overflow-x-auto'>
            <Table>
              <TableHead>
                <tr>
                  <th className='pb-3'>ID</th>
                  <th className='pb-3'>Dosar ID</th>
                  <th className='pb-3'>Program ID</th>
                  <th className='pb-3'>Prioritate</th>
                  <th className='pb-3'>Actiuni</th>
                </tr>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className='py-3 font-semibold'>{item.id}</td>
                    <td className='py-3'>{item.dosarId}</td>
                    <td className='py-3'>{item.programId}</td>
                    <td className='py-3'>{item.prioritate}</td>
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
                      Nu exista optiuni inregistrate.
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
