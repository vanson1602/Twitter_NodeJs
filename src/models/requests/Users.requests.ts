import { JwtPayload } from 'jsonwebtoken'
import { tokenType } from '~/constants/enums.js'
import { ParamsDictionary } from 'express-serve-static-core'
export interface LoginRequestBody {
  email: string
  password: string
}
export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface verifyEmailRequestBody {
  access_token: string
}
export interface LogoutRequestBody {
  refresh_token: string
}

export interface tokenPayload extends JwtPayload {
  user_id: string
  tokenType: tokenType
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface resetPasswordRequestBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowRequestBody {
  followed_user_id: string
}

export interface UnFollowRequestParams extends ParamsDictionary {
  user_id: string
}

export interface changePasswordRequestBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}
