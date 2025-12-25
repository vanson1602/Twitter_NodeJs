import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schema.js'

config()

const user = process.env.MONGO_DB_USER
const password = process.env.MONGO_DB_PASSWORD
const host = process.env.MONGO_DB_HOST
const dbName = process.env.MONGO_DB_NAME
if (!user || !password || !host || !dbName) {
  throw 'Missing MongoDB env vars: MONGO_DB_USER/PASSWORD/HOST/NAME'
}

const MONGODB_URL = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${host}/`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(MONGODB_URL)
    this.db = this.client.db(dbName)
  }

  async connectDB() {
    await this.client.connect()
    this.db = this.client.db(dbName)
    console.log('MongoDB connected, db =', this.db.databaseName)
  }

  async closeDB() {
    await this.client.close()
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
