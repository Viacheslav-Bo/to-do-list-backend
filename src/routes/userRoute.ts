import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validateBody.js';
import { updateUserSchema } from '../validators/userValidation.js';
import { getUser } from '../controllers/users/getUser.js';
import { updateUser } from '../controllers/users/updateUser.js';

const router = Router();

router.use(authenticate);
router.get('/me', getUser);
router.patch('/me', validateBody(updateUserSchema), updateUser);

export default router;
