import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-emerald-100 text-emerald-800'
      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          sync-day
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>

          {user ? (
            <>
              <NavLink to="/activities" className={linkClass}>
                Minhas Atividades
              </NavLink>
              <NavLink to="/activities/new" className={linkClass}>
                Nova Atividade
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Entrar
              </NavLink>
              <Link
                to="/register"
                className="ml-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
