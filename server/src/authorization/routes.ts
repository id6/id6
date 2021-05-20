import { Router } from 'express';
import { authorizeUser } from './handlers/authorize-user';

const router = Router();

router.post('/authorize', authorizeUser);

export default router;
