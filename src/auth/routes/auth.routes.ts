import express from 'express'
import { createSessionHandler, healthcheckHandler, refreshAccessTokenHandler } from '../controllers/auth.controller'
import validateResource from '../middlewares/validateResource'
import { createSessionSchema } from '../schema/auth.schema'

const authRoute = express.Router()

authRoute.get('/healthcheck', healthcheckHandler)

authRoute.post('/auth/sessions/create', validateResource(createSessionSchema), createSessionHandler)

authRoute.post('/auth/sessions/refresh', refreshAccessTokenHandler)

export default authRoute
