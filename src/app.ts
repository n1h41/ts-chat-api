import express from 'express';
import authRoute from './auth/routes/auth.routes';
import log from './utils/logger';
import config from 'config';
import connectToDatabase from './utils/connectToDb';
import userRouter from './auth/routes/user.routes';
import deserializeUser from './auth/middlewares/deserializeUser';

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(authRoute);
app.use(deserializeUser)

const port = config.get('port');

app.listen(port, () => {
  log.info('App launched at http://localhost:3000');
  connectToDatabase();
});
