import express from "express"
import deserializeUser from "../auth/middlewares/deserializeUser"
import authRoutes from "../auth/routes"

function createServer() {
  const app = express()

  app.use(express.json())
  app.use(deserializeUser)
  app.use(authRoutes)

  return app
}

export default createServer
