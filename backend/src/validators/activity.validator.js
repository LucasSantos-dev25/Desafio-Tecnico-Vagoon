import { body } from 'express-validator';

export const activityRules = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('data_inicio').isISO8601().withMessage('Data de início inválida'),
  body('data_fim').isISO8601().withMessage('Data de término inválida')
    .custom((data_fim, { req }) => {
      if (new Date(data_fim) <= new Date(req.body.data_inicio)) {
        throw new Error('Data de término deve ser depois da data de início');
      }
      return true;
    }),
  body('status').optional().isIn(['pendente', 'concluida', 'cancelada']),
];