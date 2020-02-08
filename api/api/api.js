/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

/**
 * server configuration
 */
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

/**
 * controllers
 */
const userController = require('./controllers/UserController');




// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const DB = dbService(environment, false).start();

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

// routes
app.get('/api/v1/test', userController.test);

//////////////////////////////////////////////////////////////
// Users
// ===========================================================
// app.get('/api/v1/users', auth, userController.getUsers);
app.post('/api/v1/users', userController.register);
// app.put('/api/v1/users', auth, userController.updateUsers);

// app.get('/api/v1/user/:id', auth, userController.getUser);
// app.put('/api/v1/user/:id', auth, userController.updateUser);
// app.delete('/api/v1/user/:id', auth, userController.disableUser);


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
