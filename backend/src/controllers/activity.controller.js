import * as activityService from '../services/activity.service.js';

export async function create(req, res, next) {
  try {
    const activity = await activityService.create(req.body, req.userId);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const activities = await activityService.list(req.userId);
    res.json(activities);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const activity = await activityService.update(req.params.id, req.body, req.userId);
    res.json(activity);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await activityService.remove(req.params.id, req.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}