import { useEffect, useState, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { Dosar, DosarView } from "~/lib/types";

const statusOptions = ["IN_LUCRU", "TRIMIS", "VALIDAT"];

const emptyForm = {
  candidatId: "",
  status: "IN_LUCRU",
  medie: "",
};

export default function DosarePage() {
  const [items, setItems] = useState<DosarView[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await api<DosarView[]>("/api/admin/dosare");
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

    const candidatId = parseRequiredNumber(form.candidatId, "candidat ID");
    if (candidatId === null) {
      return;
    }

    let medie: number | null = null;
    if (form.medie.trim()) {
      const parsed = Number(form.medie);
      if (Number.isNaN(parsed)) {
        setError("Campul medie trebuie sa fie numeric.");
        return;
      }
      medie = parsed;
    }

    const payload = {
      candidatId,
      status: form.status,
      medie,
    };

    try {
      if (editingId) {
        await api<Dosar>(`/api/admin/dosare/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<Dosar>("/api/admin/dosare", {
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

  const startEdit = (item: Dosar) => {
    setForm({
      candidatId: String(item.candidatId),
      status: item.status,
      medie: item.medie === null ? "" : String(item.medie),
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
      await api<void>(`/api/admin/dosare/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergere esuata.");
    }
  };

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Dosare'
        description='Administrare dosare, statusuri si medii finale.'
      />

      <div className='grid gap-6 lg:grid-cols-[1fr_5fr] items-start'>
        <Card className='p-6'>
          <h3 className='font-display text-xl'>
            {editingId ? "Editeaza dosar" : "Adauga dosar"}
          </h3>
          <form
            className='mt-5 space-y-4'
            onSubmit={handleSubmit}>
            <FormField
              label='Candidat ID'
              htmlFor='candidat-id'>
              <input
                id='candidat-id'
                className='input'
                value={form.candidatId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    candidatId: event.target.value,
                  }))
                }
                placeholder='Ex: 12'
                required
              />
            </FormField>
            <FormField
              label='Status'
              htmlFor='status-dosar'>
              <select
                id='status-dosar'
                className='input'
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value }))
                }>
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              label='Medie (optional)'
              htmlFor='medie-dosar'>
              <input
                id='medie-dosar'
                className='input'
                value={form.medie}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, medie: event.target.value }))
                }
                placeholder='Ex: 9.85'
              />
            </FormField>
            <ErrorBanner message={error} />
            <div className='flex flex-wrap gap-3'>
              <button
                className='btn btn-primary'
                type='submit'>
                {editingId ? "Salveaza modificari" : "Adauga dosar"}
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
            title='Lista dosare'
            meta={<span className='pill'>{items.length} inregistrari</span>}
          />
          <div className='mt-4 overflow-x-auto'>
            <Table>
              <TableHead>
                <tr>
                  <th className='pb-3'>ID</th>
                  <th className='pb-3'>Candidat ID</th>
                  <th className='pb-3'>Candidat</th>
                  <th className='pb-3'>Status</th>
                  <th className='pb-3'>Medie</th>
                  <th className='pb-3'>Creat</th>
                  <th className='pb-3 text-right'>Actiuni</th>
                </tr>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className='py-3 font-semibold'>{item.id}</td>
                    <td className='py-3'>{item.candidatId}</td>
                    <td className='py-3'>
                      {item.candidatNume} {item.candidatPrenume}
                    </td>
                    <td className='py-3'>{item.status}</td>
                    <td className='py-3'>{item.medie ?? "-"}</td>
                    <td className='py-3 text-xs text-(--muted)'>
                      {item.createdAt}
                    </td>
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
                      colSpan={7}>
                      Nu exista dosare inregistrate.
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
