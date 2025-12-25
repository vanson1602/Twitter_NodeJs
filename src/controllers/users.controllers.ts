import { Request, Response } from 'express'
import usersService from '~/services/users.services.js'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/Users.requests.js'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'vovansonha2019@gmail.com' && password === '123456') {
    return res.status(200).json({
      message: 'Login success'
    })
  }
  return res.status(400).json({
    message: 'login failed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body)
  try {
    return res.json({
      message: 'Register Success',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error: error
    })
  }
}
