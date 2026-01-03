import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services.js'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  resetPasswordRequestBody,
  tokenPayload,
  UpdateMeRequestBody,
  verifyEmailRequestBody
} from '~/models/requests/Users.requests.js'
import User from '~/models/schemas/User.schema.js'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { USERS_MESSAGES } from '~/constants/messages.js'
import { UserVerifyStatus } from '~/constants/enums.js'
import { pick } from 'lodash'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: 'Login success',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register success',
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const refresh_token = req.body.refresh_token
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, verifyEmailRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_email_verify_token as tokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  // nếu ko tìm thấy user thì mình báo lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  // đã verify rồi thì mình sẽ không báo lỗi
  // mà mình sẽ trả về status OK với message là đã verify trước đó rồi
  if (user?.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decode_authorization as tokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.status(HTTP_STATUS.OK).json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_forgot_password_token as tokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as tokenPayload
  const result = await usersService.getMe(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: result
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as tokenPayload
  const { body } = req
  const result = await usersService.updateMe(user_id, body)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    data: result
  })
}
