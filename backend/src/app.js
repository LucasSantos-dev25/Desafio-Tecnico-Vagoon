import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API online e funcionando!' });
});

export default app;