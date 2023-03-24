import express from 'express'
import user from './user.routes'
import auth from './auth.routes'

const authRoutes = express.Router()

authRoutes.get('/healthcheck', (_, res) => {
  res.sendStatus(201)
})

authRoutes.use(user)
authRoutes.use(auth)

export default authRoutes
