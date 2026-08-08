import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
  origin: (origin, callback) => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (!origin || allowedOrigins.includes(origin) || (isDev && isLocalOrigin(origin))) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pelo CORS'));
  },
}));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API online e funcionando!' });
});

export default app;