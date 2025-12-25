import express, { ErrorRequestHandler } from 'express'
import usersRouter from '~/routes/users.route.js'
import databaseService from './services/database.services.js'
import { NextFunction, Request, Response } from 'express'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/users', usersRouter)

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err })
})

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
