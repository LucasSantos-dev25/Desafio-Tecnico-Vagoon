import db from '../models/index.js';

const { Activity } = db;

export function create(data, userId) {
  return Activity.create({ ...data, userId });
}

export function list(userId) {
  return Activity.findAll({ where: { userId }, order: [['data_inicio', 'ASC']] });
}

export async function findById(id, userId) {
  const activity = await Activity.findOne({ where: { id, userId } });
  if (!activity) {
    const error = new Error('Atividade não encontrada');
    error.status = 404;
    throw error;
  }
  return activity;
}

export async function update(id, data, userId) {
  const activity = await findById(id, userId);
  return activity.update(data);
}

export async function remove(id, userId) {
  const activity = await Activity.findOne({ where: { id, userId } });
  if (!activity) {
    const error = new Error('Atividade não encontrada');
    error.status = 404;
    throw error;
  }
  await activity.destroy();
}