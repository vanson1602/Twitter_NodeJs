import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers.js'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
