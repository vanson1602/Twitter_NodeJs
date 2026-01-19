import express from 'express'
import usersRouter from '~/routes/users.route.js'
import databaseService from './services/database.services.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import { config } from 'dotenv'
import mediaRouter from './routes/media.route.js'
import { initFolder } from './utils/file.js'
import { UPLOAD_IMAGE_DIR } from './constants/dir.js'
import staticRouter from './routes/static.route.js'

config()

const app = express()

const port = process.env.PORT

const startServer = async () => {
  try {
    await databaseService.connectDB()

    const server = app.listen(port, () => {
      console.log(`SERVER IS RUNNING ON PORT: ${port}`)
    })

    server.on('error', (error) => {
      console.log('SERVER ERROR:', error)
      process.exit(1)
    })

    process.on('SIGINT', async () => {
      await databaseService.closeDB()
      process.exit(0)
    })
  } catch (error) {
    console.log('MONGOOSE_DB CONNECTION FAILED!!!', error)
  }
}

startServer()
initFolder()
app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/static', staticRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use(defaultErrorHandler)
