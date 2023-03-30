import express from "express"
import deserializeUser from "../auth/middlewares/deserializeUser"
import authRoutes from "../auth/routes"
import chatRoutes from "../chat/routes"

function createServer() {
  const app = express()

  app.use(express.json())
  app.use(deserializeUser)
  app.use(authRoutes)
  app.use("/chat", chatRoutes)

  return app
}

export default createServer
