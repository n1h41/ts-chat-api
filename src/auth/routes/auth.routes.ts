import express from 'express'
import { createSessionHandler, refreshAccessTokenHandler } from '../controllers/auth.controller'
import validateResource from '../middlewares/validateResource'
import { createSessionSchema } from '../schema/auth.schema'

const auth = express.Router()

auth.post('/auth/sessions/create', validateResource(createSessionSchema), createSessionHandler)

auth.post('/auth/sessions/refresh', refreshAccessTokenHandler)

export default auth
