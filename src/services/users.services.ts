import User from '~/models/schemas/User.schema.js'
import databaseService from './database.services.js'

class UsersService {
  async register(email: string, password: string) {
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }

  async checkEmailExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    console.log('result: ', result)
    return Boolean(result)
  }
}

const usersService = new UsersService()
export default usersService
