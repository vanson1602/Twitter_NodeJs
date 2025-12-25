import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers.js'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares.js'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
