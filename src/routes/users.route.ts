import { Router } from 'express'
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers.js'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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

/*
 * description: submit email to reset password
 * path: /forgot-password
 * method: POST
 * body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/*
 * description: verify link email to reset password
 * path: /verify-forgot-password
 * method: POST
 * body: { forgot-password-token }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/*
 * description: reset password
 * path: /verify-forgot-password
 * method: POST
 * body: { forgot_password_token, new_password, confirm_new_password }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/*
 * description: get my profile
 * path: /me
 * header: {Authorization: Bearer <access_token>}
 * method: GET
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

export default usersRouter
