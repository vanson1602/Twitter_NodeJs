import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unFollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers.js'
import { filterMiddleWares } from '~/middlewares/common.middlewares.js'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares.js'
import { UpdateMeRequestBody } from '~/models/requests/Users.requests.js'
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

/*
 * description: update my profile
 * path: /me
 * header: {Authorization: Bearer <access_token>}
 * body: {user schema}
 * method: GET
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleWares<UpdateMeRequestBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'avatar',
    'username',
    'cover_photo',
    'website'
  ]),
  wrapRequestHandler(updateMeController)
)

/*
 * description: get user profile
 * path: /:username
 * method: GET
 */
usersRouter.get('/:username', wrapRequestHandler(getUserProfileController))

/*
 * description: follow some user
 * path: /follow
 * method: POST
 * header: {Authorization: Bearer <access_token>}
 * body: { followed_user_id }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/*
 * description: un follow some user
 * path:   '/follow/:user_id',
 * method: DELETE
 * header: {Authorization: Bearer <access_token>}
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)

/*
 * description: change password
 * path:   '/follow/:user_id',
 * method: PUT
 * header: {Authorization: Bearer <access_token>}
 * body { old_password, new_password, confirm_new_password}
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
