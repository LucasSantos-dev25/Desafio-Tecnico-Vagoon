import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.js';
import { registerRules, loginRules } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerRules, validate, controller.register);
router.post('/login', loginRules, validate, controller.login);

export default router;