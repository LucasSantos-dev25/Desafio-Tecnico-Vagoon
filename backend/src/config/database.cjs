require('dotenv').config();

const dialectOptions =
  process.env.DB_SSL === 'true'
    ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
    : {};

const shared = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT || 'mysql',
  dialectOptions,
};

module.exports = {
  development: { ...shared },
  production: { ...shared },
};
