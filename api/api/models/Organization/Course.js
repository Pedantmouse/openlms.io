const Sequelize = require('sequelize');
const databases = require('../../../config/databases');
const db = databases.lms;

const tableName = 'courses';

const Course = db.define('User', {
  name: {
    type: Sequelize.STRING,
    // unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  subjectId: {
    type: Sequelize.INTEGER

  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: false
  }

}, { tableName });

// // eslint-disable-next-line
// User.prototype.toJSON = function () {
//   const values = Object.assign({}, this.get());

//   delete values.password;

//   return values;
// };

module.exports = Course;
