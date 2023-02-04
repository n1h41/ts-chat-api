import express from "express"
import authRoute from "../auth/routes/auth.routes"
import userRouter from "../auth/routes/user.routes"

function createServer() {
  const app = express()

  app.use(express.json())
  app.use(userRouter)
  app.use(authRoute)

  return app
}

export default createServer
