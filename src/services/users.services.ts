import User from '~/models/schemas/User.schema.js'
import databaseService from './database.services.js'
import { RegisterRequestBody } from '~/models/requests/Users.requests.js'
import { hashPassword } from '~/utils/crypto.js'
import { signToken } from '~/utils/jwt.js'
import { tokenType } from '~/constants/enums.js'
import type { StringValue } from 'ms'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPRIES_IN as StringValue
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPRIES_IN as StringValue
      }
    })
  }

  async register(payload: RegisterRequestBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      accessToken,
      refreshToken
    }
  }

  async checkEmailExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
}

const usersService = new UsersService()
export default usersService
