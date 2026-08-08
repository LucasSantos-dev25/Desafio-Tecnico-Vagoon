import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User } = db;

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export async function register({ login, senha }) {
  const exists = await User.findOne({ where: { login } });
  if (exists) {
    const error = new Error('Login já está em uso');
    error.status = 409;
    throw error;
  }

  const user = await User.create({ login, senha });
  return { id: user.id, login: user.login, token: generateToken(user.id) };
}

export async function login({ login, senha }) {
  const user = await User.findOne({ where: { login } });
  if (!user || !(await user.checkPassword(senha))) {
    const error = new Error('Login ou senha inválidos');
    error.status = 401;
    throw error;
  }

  return { id: user.id, login: user.login, token: generateToken(user.id) };
}