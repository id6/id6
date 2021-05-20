import { Router } from 'express';
import { authenticate } from './middlewares/authenticate';
import { signOut } from './handlers/sign-out';
import { getAuthMethods } from './handlers/get-auth-methods';
import { redirectToUi } from './handlers/redirect-to-ui';
import { noContent } from '../commons/express/no-content';
import { whoAmI } from './handlers/who-am-i';
import { register } from './handlers/register';
import { getEnv } from './handlers/get-env';
import { confirmEmail } from './handlers/confirm-email';
import { forgotPassword } from './handlers/forgot-password';
import { resetPassword } from './handlers/reset-password';
import { resendConfirm } from './handlers/resend-confirm';
import { updateProfile } from './handlers/update-profile';
import { updatePicture } from './handlers/update-picture';
import { getPicture } from './handlers/get-picture';
import { authenticate as passportLocal } from './passport/local';
import { authenticate as passportInMemory } from './passport/in-memory';
import { authenticate as passportGoogle, google_callback, google_redirect } from './passport/google';
import { authenticate as passportGitlab, gitlab_callback, gitlab_redirect } from './passport/gitlab';
import { authenticate as passportGithub, github_callback, github_redirect } from './passport/github';
import { authenticate as passportGitea, gitea_callback, gitea_redirect } from './passport/gitea';
import { revokeTokens } from './handlers/revoke-tokens';

const router = Router();

// passport
router.get(gitlab_redirect, passportGitlab);
router.get(gitlab_callback, passportGitlab, authenticate, redirectToUi);
router.get(gitea_redirect, passportGitea);
router.get(gitea_callback, passportGitea, authenticate, redirectToUi);
router.get(google_redirect, passportGoogle);
router.get(google_callback, passportGoogle, authenticate, redirectToUi);
router.get(github_redirect, passportGithub);
router.get(github_callback, passportGithub, authenticate, redirectToUi);
router.post('/auth/in-memory', passportInMemory, authenticate, noContent);
router.post('/auth/local', passportLocal, authenticate, noContent);

// auth
router.get('/env', getEnv);
router.post('/auth/signout', signOut);
router.get('/auth/methods', getAuthMethods);
router.post('/auth/register', register);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/email/confirm', confirmEmail);
router.post('/email/confirm/send', resendConfirm);

// user
router.get('/user', whoAmI);
router.post('/user/profile', updateProfile);
router.post('/user/picture', updatePicture);
router.get('/user/picture', getPicture);
router.get('/user/disconnect', revokeTokens);

export default router;
