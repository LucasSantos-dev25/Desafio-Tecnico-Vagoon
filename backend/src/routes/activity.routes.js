import { Router } from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import * as controller from '../controllers/activity.controller.js';
import { activityRules } from '../validators/activity.validator.js';

const router = Router();
router.use(auth);

router.post('/', activityRules, validate, controller.create);
router.get('/', controller.list);
router.get('/:id', controller.show);
router.put('/:id', activityRules, validate, controller.update);
router.delete('/:id', controller.remove);

export default router;