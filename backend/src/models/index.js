import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import dbConfig from '../config/database.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env] || dbConfig.development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.model.js'));

for (const file of modelFiles) {
  const modulePath = pathToFileURL(path.join(__dirname, file)).href;
  const { default: defineModel } = await import(modulePath);
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;