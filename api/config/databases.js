const Sequelize = require('sequelize');
const path = require('path');

let databases= {};

databases.accountManager = new Sequelize(
  process.env.DB_NAME_ACCOUNT_MANAGER,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

databases.crm = new Sequelize(
  process.env.DB_NAME_CRM,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

databases.cms = new Sequelize(
  process.env.DB_NAME_CMS,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

databases.lms = new Sequelize(
  process.env.DB_NAME_LMS,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

module.exports = databases;
