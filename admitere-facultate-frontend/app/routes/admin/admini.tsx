import { useEffect, useState, type FormEvent } from "react";
import { Card } from "~/components/Card";
import { CardHeader } from "~/components/CardHeader";
import { ErrorBanner } from "~/components/ErrorBanner";
import { FormField } from "~/components/FormField";
import { SectionHeader } from "~/components/SectionHeader";
import { Table, TableBody, TableHead } from "~/components/Table";
import { api } from "~/lib/api";
import type { Admin } from "~/lib/types";

const emptyForm = {
  email: "",
  parola: "",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ro-RO");
};

export default function AdminiPage() {
  const [items, setItems] = useState<Admin[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await api<Admin[]>("/api/admin/admini");
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

    const email = form.email.trim();
    const parola = form.parola.trim();

    if (!email) {
      setError("Introdu emailul administratorului.");
      return;
    }

    if (!editingId && !parola) {
      setError("Parola este obligatorie la creare.");
      return;
    }

    const payload = { email, parola };

    try {
      if (editingId) {
        await api<Admin>(`/api/admin/admini/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api<Admin>("/api/admin/admini", {
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

  const startEdit = (item: Admin) => {
    setForm({
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
      await api<void>(`/api/admin/admini/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergere esuata.");
    }
  };

  return (
    <section className='space-y-8'>
      <SectionHeader
        title='Administratori'
        description='Gestionare conturi admin si resetare parole.'
      />

      <div className='grid gap-6 lg:grid-cols-[1fr_5fr] items-start'>
        <Card className='p-6'>
          <h3 className='font-display text-xl'>
            {editingId ? "Editeaza administrator" : "Adauga administrator"}
          </h3>
          <form
            className='mt-5 space-y-4'
            onSubmit={handleSubmit}>
            <FormField
              label='Email'
              htmlFor='email-admin'>
              <input
                id='email-admin'
                className='input'
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder='admin@facultate.ro'
                required
              />
            </FormField>
            <FormField
              label='Parola (noua)'
              htmlFor='parola-admin'>
              <input
                id='parola-admin'
                className='input'
                value={form.parola}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, parola: event.target.value }))
                }
                placeholder={
                  editingId ? "Lasa gol pentru pastrare" : "Parola obligatorie"
                }
                type='password'
              />
            </FormField>
            <ErrorBanner message={error} />
            <div className='flex flex-wrap gap-3'>
              <button
                className='btn btn-primary'
                type='submit'>
                {editingId ? "Salveaza modificari" : "Adauga admin"}
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
            title='Lista administratori'
            meta={<span className='pill'>{items.length} inregistrari</span>}
          />
          <div className='mt-4 overflow-x-auto'>
            <Table>
              <TableHead>
                <tr>
                  <th className='pb-3'>ID</th>
                  <th className='pb-3'>Email</th>
                  <th className='pb-3'>Creat</th>
                  <th className='pb-3'>Actiuni</th>
                </tr>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className='py-3 font-semibold'>{item.id}</td>
                    <td className='py-3'>{item.email}</td>
                    <td className='py-3 text-xs text-(--muted)'>
                      {formatDate(item.createdAt)}
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
                      colSpan={4}>
                      Nu exista administratori inregistrati.
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
