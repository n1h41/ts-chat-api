import express from 'express'
import { healthcheckHandler } from '../controllers/auth.controller'

const authRoute = express.Router()

authRoute.get('/healthcheck', healthcheckHandler)

export default authRoute
