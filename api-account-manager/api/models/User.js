const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const databases = require('../../config/databases');
const sequelize = databases.accounts;

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'users';

const User = sequelize.define('User', {
  email: {
    type: Sequelize.STRING,
    // unique: true,
    allowNull:false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull:false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull:false
  },
  isBanned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull:false
  },
  isDisabled:{
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull:false
  },
  isOrganizationMember:{
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull:false
  }
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;
