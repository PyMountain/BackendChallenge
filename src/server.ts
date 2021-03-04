import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './router';
import amqp from 'amqplib/callback_api';
import { processStockQueue } from './util/amqpUtils';
import { handleException } from './util/middlewares';
import config from './util/config';

const MONGO_URL = `mongodb://${config.dbConfig.port}:${config.dbConfig.port}/${config.dbConfig.database}`;
const APP_PORT = config.appPort;
const INCREASE_QUEUE = config.stockIncreaseQueueName;
const DECREASE_QUEUE = config.stockDecreaseQueueName;

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

//AMQP connection
amqp.connect(config.amqpConfig, function(err, conn) {
  if(err) {
    console.log(`FAILED TO CONNECT TO AMQP, ${err}`);
    return;
  }

  conn.createChannel((err, ch) => {
    if(err) {
      console.log(`FAILED TO CREATE AMQP CHANNEL, ${err}`);
      return;
    }

    ch.assertExchange('stock', 'direct', {durable: true});

    ch.assertQueue(INCREASE_QUEUE, {durable: true}, (err, q) => {
      if(err) {
        console.log(`FAILED TO CONECT TO QUEUE ${INCREASE_QUEUE}, ${err}`);
        return;
      }

      ch.bindQueue(q.queue, 'stock', 'incremented');

      ch.consume(q.queue, msg => processStockQueue(msg, 'INCREASE', INCREASE_QUEUE), {noAck: true});
    });

    ch.assertQueue(DECREASE_QUEUE, {durable: true}, (err, q) => {
      if(err) {
        console.log(`FAILED TO CONECT TO QUEUE ${DECREASE_QUEUE}, ${err}`);
        return;
      }

      ch.bindQueue(q.queue, 'stock', 'decremented');

      ch.consume(q.queue, msg => processStockQueue(msg, 'DECREASE', DECREASE_QUEUE), {noAck: true});
    });
  });
});

//App deploy
app.listen(APP_PORT, () => {
  console.info(`[Server] : Running at ---> https://localhost:${APP_PORT}`);
});