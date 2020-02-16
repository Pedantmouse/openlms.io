const Sequelize = require('sequelize');
const databases = require('../../config/databases');
const db = databases.lms;
const User = require('./User')

const tableName = 'users_profile';

const UserProfile = db.define('UserProfile', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: Sequelize.STRING
    },
    website: {
        type: Sequelize.STRING
    },
}, { tableName });

module.exports = UserProfile;
