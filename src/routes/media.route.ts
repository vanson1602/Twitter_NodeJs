import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers.js'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const mediaRouter = Router()

mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)
mediaRouter.post(
  '/upload-video',
  // accessTokenValidator,
  // verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

export default mediaRouter
