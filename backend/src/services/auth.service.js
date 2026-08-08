import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User } = db;

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function toAuthResponse(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    token: generateToken(user.id),
  };
}

export async function register({ nome, email, senha }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    const error = new Error('E-mail já está em uso');
    error.status = 409;
    throw error;
  }

  const user = await User.create({ nome, email, senha });
  return toAuthResponse(user);
}

export async function login({ email, senha }) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.checkPassword(senha))) {
    const error = new Error('E-mail ou senha inválidos');
    error.status = 401;
    throw error;
  }

  return toAuthResponse(user);
}