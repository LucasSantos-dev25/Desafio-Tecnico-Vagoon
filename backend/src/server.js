import 'dotenv/config';
import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3001;
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await db.sequelize.authenticate();
      return;
    } catch (err) {
      console.log(
        `Banco indisponível (tentativa ${attempt}/${MAX_RETRIES}): ${err.message}`
      );
      if (attempt === MAX_RETRIES) throw err;
      await sleep(RETRY_DELAY_MS);
    }
  }
}

async function start() {
  try {
    await connectWithRetry();

    if (process.env.NODE_ENV !== 'production') {
      await db.sequelize.sync();
      console.log('Banco de dados conectado e sincronizado (sync)');
    } else {
      // Em produção o schema é criado via migrations (npm run migrate)
      console.log('Banco de dados conectado');
    }

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao conectar no banco de dados:', err.message);
    process.exit(1);
  }
}

start();
