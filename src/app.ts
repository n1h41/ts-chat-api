import express from 'express';
import authRoute from './auth/routes/auth.routes';
import log from './utils/logger';
import config from 'config';
import connectToDatabase from './utils/connectToDb';
import userRouter from './auth/routes/user.routes';

const app = express();

app.use(express.json());
app.use(authRoute);
app.use(userRouter);

const port = config.get('port');

app.listen(port, () => {
  log.info('App started at http://localhost:3000');
  connectToDatabase();
});
