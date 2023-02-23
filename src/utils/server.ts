import express from "express"
import auth from "../auth/routes/auth.routes"
import user from "../auth/routes/user.routes"
import deserializeUser from "../auth/middlewares/deserializeUser"
import router from "../auth/routes"

function createServer() {
  const app = express()

  app.use(express.json())
  app.use(deserializeUser)
  app.use(router)

  return app
}

export default createServer
