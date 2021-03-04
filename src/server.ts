import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './router';
import { handleException } from './util/middlewares';

//CONFIGUIFY THIS LATER!!!
const MONGO_URL = 'mongodb://localhost:27017/seuze_mercadinho'
const APP_PORT = 3000

//App configuration
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Route definition
app.use(routes);

//Exception handling middleware
app.use(handleException);

//Database connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => {
  console.info(`[MongoDB] : Running at ---> ${MONGO_URL}`);
})
.catch((err) => {
  console.error(`[MongoDB] : ERROR ---> ${err.message}`);
});

//App deploy
app.listen(APP_PORT, () => {
  console.info(`[Server] : Running at ---> https://localhost:${APP_PORT}`);
});