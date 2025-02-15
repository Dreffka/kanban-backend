require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const commonConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  migrations: {
    directory: './migrations'
  }
};

module.exports = {
  development: { ...commonConfig },
  production: { ...commonConfig }
};
