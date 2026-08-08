import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const statusOptions = ['pendente', 'concluida', 'cancelada'];

function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const emptyForm = (defaultDate) => ({
  nome: '',
  descricao: '',
  data_inicio: defaultDate ? `${defaultDate}T09:00` : '',
  data_fim: defaultDate ? `${defaultDate}T10:00` : '',
  status: 'pendente',
});

export default function ActivityForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => emptyForm(searchParams.get('data')));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/activities/${id}`)
      .then(({ data }) => {
        setForm({
          nome: data.nome,
          descricao: data.descricao || '',
          data_inicio: toDatetimeLocal(data.data_inicio),
          data_fim: toDatetimeLocal(data.data_fim),
          status: data.status,
        });
      })
      .catch((err) => setError(err.response?.data?.error || 'Erro ao carregar atividade'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function handleChange(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function toPayload() {
    return {
      ...form,
      data_inicio: new Date(form.data_inicio).toISOString(),
      data_fim: new Date(form.data_fim).toISOString(),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/activities/${id}`, toPayload());
      } else {
        await api.post('/activities', toPayload());
      }
      navigate('/activities');
    } catch (err) {
      const validationError = err.response?.data?.errors?.[0]?.msg;
      setError(validationError || err.response?.data?.error || 'Erro ao salvar atividade');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade?')) return;
    try {
      await api.delete(`/activities/${id}`);
      navigate('/activities');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir atividade');
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50/50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar atividade' : 'Nova atividade'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os dados da sua atividade
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-12 text-center text-gray-400">Carregando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="nome" className="mb-1 block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={handleChange('nome')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Ex.: Reunião de planejamento"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="mb-1 block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  rows={3}
                  value={form.descricao}
                  onChange={handleChange('descricao')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Detalhes da atividade (opcional)"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="data_inicio" className="mb-1 block text-sm font-medium text-gray-700">
                    Início
                  </label>
                  <input
                    id="data_inicio"
                    type="datetime-local"
                    required
                    value={form.data_inicio}
                    onChange={handleChange('data_inicio')}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label htmlFor="data_fim" className="mb-1 block text-sm font-medium text-gray-700">
                    Término
                  </label>
                  <input
                    id="data_fim"
                    type="datetime-local"
                    required
                    value={form.data_fim}
                    onChange={handleChange('data_fim')}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={handleChange('status')}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/activities')}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {submitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
