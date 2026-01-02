import { tokenPayload } from './models/requests/Users.requests.ts'
import User from './models/schemas/User.schema.ts'

export {}

declare global {
  namespace Express {
    interface Request {
      user?: User
      decode_authorization?: tokenPayload
      decode_refresh_token?: tokenPayload
      decode_email_verify_token?: tokenPayload
      decode_forgot_password_token?: tokenPayload
    }
  }
}
