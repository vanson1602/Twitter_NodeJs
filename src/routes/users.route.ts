import { Router } from 'express'
import {
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController
} from '~/controllers/users.controllers.js'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'
const usersRouter = Router()

/*
 * description: login a user
 * path: /login
 * method: POST
 * body: { email, password }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/*
 * description: register a user
 * path: /register
 * method: POST
 * body: { name, password, confirm_password, email, date }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/*
 * description: register a user
 * path: /logout
 * method: POST
 * header: {Authorization: Bearer <access_token>}
 * body: { refresh-token }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/*
 * description: verify email when user click on the link in email
 * path: /verify-email
 * method: POST
 * body: { email-verify-token }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/*
 * description: resend email verify when user click resend button
 * path: /resend-email
 * method: POST
 * header: {Authorization: Bearer <access_token>}
 * body: { }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

export default usersRouter
