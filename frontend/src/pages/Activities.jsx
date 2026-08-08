import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ActivityCalendar from '../components/ActivityCalendar';

const statusStyles = {
  pendente: 'bg-amber-100 text-amber-800',
  concluida: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-700',
};

function formatDateTime(value) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    api
      .get('/activities')
      .then(({ data }) => {
        if (active) setActivities(data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.error || 'Erro ao carregar atividades');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Atividades</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualize e gerencie tudo o que você agendou
            </p>
          </div>
          <Link
            to="/activities/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            + Nova atividade
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-gray-400">Carregando atividades...</p>
        ) : (
          <>
            <section className="mb-10 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <ActivityCalendar
                activities={activities}
                onEventClick={(id) => navigate(`/activities/${id}/edit`)}
                onDateClick={(dateStr) => navigate(`/activities/new?data=${dateStr}`)}
              />
            </section>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Próximas atividades</h2>
              {activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center">
                  <p className="text-gray-500">Nenhuma atividade cadastrada ainda.</p>
                  <Link
                    to="/activities/new"
                    className="mt-2 inline-block font-medium text-emerald-700 hover:underline"
                  >
                    Criar a primeira atividade
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {activities.map((activity) => (
                    <li
                      key={activity.id}
                      className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{activity.nome}</h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[activity.status]}`}
                          >
                            {activity.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatDateTime(activity.data_inicio)} até{' '}
                          {formatDateTime(activity.data_fim)}
                        </p>
                        {activity.descricao && (
                          <p className="mt-1 text-sm text-gray-400">{activity.descricao}</p>
                        )}
                      </div>
                      <Link
                        to={`/activities/${activity.id}/edit`}
                        className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                      >
                        Editar
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
