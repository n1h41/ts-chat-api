import express from 'express'

const chatRouter = express.Router();

chatRouter.get('/chat/healthcheck', (_, res) => {
  res.sendStatus(201);
})
