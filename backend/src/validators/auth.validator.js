import { body } from 'express-validator';

export const registerRules = [
  body('nome').notEmpty().withMessage('Nome é obrigatório').trim(),
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
];

export const loginRules = [
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
];