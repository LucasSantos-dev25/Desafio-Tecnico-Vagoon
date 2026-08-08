import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const features = [
  {
    title: 'Agende com facilidade',
    description: 'Crie atividades com data e hora de início e término em poucos cliques.',
  },
  {
    title: 'Acompanhe o status',
    description: 'Marque suas atividades como pendentes, concluídas ou canceladas.',
  },
  {
    title: 'Visualize no calendário',
    description: 'Veja tudo o que está agendado em um calendário simples e intuitivo.',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Organize seu dia em <span className="text-emerald-600">sincronia</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
            O sync-day ajuda você a planejar, acompanhar e concluir suas atividades
            com um visual simples e suave.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to={user ? '/activities' : '/register'}
              className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              {user ? 'Ver minhas atividades' : 'Começar agora'}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="rounded-xl border border-emerald-200 px-8 py-3 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Já tenho conta
              </Link>
            )}
          </div>
        </section>

        <section className="bg-emerald-50/60 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-10 w-10 rounded-xl bg-emerald-100" />
                <h2 className="text-lg font-semibold text-gray-900">{feature.title}</h2>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
