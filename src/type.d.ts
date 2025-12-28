import User from './models/schemas/User.schema.ts'

export {}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
