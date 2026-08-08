import { useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './auth-context';

function getStoredUser() {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  return token && savedUser ? JSON.parse(savedUser) : null;
}

function persistSession(data) {
  const user = { id: data.id, nome: data.nome, email: data.email };
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    setUser(persistSession(data));
  }

  async function register(nome, email, senha) {
    const { data } = await api.post('/auth/register', { nome, email, senha });
    setUser(persistSession(data));
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
