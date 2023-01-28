import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

async function connectToDatabase() {
  const dbUrl = config.get<string>('dbUrl')
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(dbUrl)
    log.info("Database connection established")
  } catch(e) {
    log.error(e)
  }
}

export default connectToDatabase
