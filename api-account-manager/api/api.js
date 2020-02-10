/**
 * third party libraries
 */
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

/**
 * server configuration
 */
const dbService = require('./services/db.service');
const authService = require('./services/auth.service');
const auth = require('./policies/auth.policy');


/**
 * controllers
 */
const authController = require('./controllers/AuthController');
const testController = require('./controllers/TestController');




// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const databases = require('../config/databases');


const app = express();
const server = http.Server(app);
const DB = dbService({migrate: process.env.DB_MIGRATE && process.env.DB_MIGRATE === 'true'}).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', authService.tokenMiddleware({excludedRoutes:[
  '/api/v1/auth/*',
  '/api/v1/test'
]}));

// routes
// app.get('/api/v1/test', authController.test);
app.get('/api/v1/test', testController.test);


//////////////////////////////////////////////////////////////
// Auth Below
// ===========================================================
app.post('/api/v1/auth/register/email', authController.register);
app.post('/api/v1/auth/login/email', authController.login);
app.post('/api/v1/auth/token/validate', authController.validateToken);
app.post('/api/v1/auth/token/refresh', authController.refreshToken);
app.post('/api/v1/auth/forgot-password', authController.forgotPassword);
app.post('/api/v1/auth/disable', authController.disable);
app.post('/api/v1/auth/reactivate', authController.reactivate);


//////////////////////////////////////////////////////////////
// Auth Above
// ===========================================================
// Admin Permissions And Roles
//////////////////////////////////////////////////////////////


// app.get('/api/v1/users', auth, authController.getUsers);
// app.put('/api/v1/users', auth, authController.updateUsers);

// app.get('/api/v1/user/:id', auth, authController.getUser);
// app.put('/api/v1/user/:id', auth, authController.updateUser);
// app.delete('/api/v1/user/:id', auth, authController.disableUser);


server.listen(process.env.PORT || '2017', () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
