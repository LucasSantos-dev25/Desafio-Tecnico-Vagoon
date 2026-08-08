import { body } from 'express-validator';

export const registerRules = [
  body('login').notEmpty().withMessage('Login é obrigatório').trim(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
];

export const loginRules = [
  body('login').notEmpty().withMessage('Login é obrigatório'),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
];