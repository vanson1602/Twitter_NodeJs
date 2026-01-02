import { JwtPayload } from 'jsonwebtoken'
import { tokenType } from '~/constants/enums.js'

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
