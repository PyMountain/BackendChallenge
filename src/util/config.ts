const dotenv = require('dotenv');

dotenv.config();

export interface AppConfig {
  appPort: number,
  stockExchangeName: string,
  stockIncreaseQueueName: string,
  stockDecreaseQueueName: string
  dbConfig: DbConfig,
  amqpConfig: AMQPConfig
}

export interface DbConfig {
  url: string,
  database: string,
  port: number
}

export interface AMQPConfig {
  protocol: string,
  hostname: string,
  port:     number,
  username: string,
  password: string
}

const appConfig: AppConfig = {
  appPort : Number(process.env.DEV_APP_PORT) || 3000,
  stockExchangeName: process.env.AMQP_EXCHANGE || '',
  stockIncreaseQueueName: process.env.AMQP_QUEUE_INCREASE || '',
  stockDecreaseQueueName: process.env.AMQP_QUEUE_DECREASE || '',
  dbConfig : { 
    url :     process.env.DB_URL || 'localhost',
    database: process.env.DB_DATABASE || '',
    port:     Number(process.env.DB_PORT) || 27020
  },
  amqpConfig: {
    protocol: process.env.AMQP_PROTOCOL || 'amqp',
    hostname: process.env.AMQP_HOST     || 'localhost',
    port: Number(process.env.AMQP_PORT) || 5672,
    username: process.env.AMQP_USERNAME || '',
    password: process.env.AMQP_PASSWORD || ''
  }
}

export default appConfig;
