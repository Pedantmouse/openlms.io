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


/**
 * controllers
 */
const authController = require('./controllers/AuthController');
const testController = require('./controllers/TestController');
const genericController = require('./controllers/GenericController');

//Admin
const adminUserController = require('./controllers/Admin/UserController');
const adminPermissionsController = require('./controllers/Admin/PermissionsController');
const adminRolesController = require('./controllers/Admin/RolesController');

//Organization
const courseController = require('./controllers/Organization/CourseController');




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
// Admin Below
//////////////////////////////////////////////////////////////
//get permissions to map for user and roles.

//manager permissions.
app.get('/api/v1/admin/permissions', authService.onlyAdmin, adminPermissionsController.getMany);
app.delete('/api/v1/admin/permissions/:name', authService.onlyAdmin, adminPermissionsController.deleteOne);

//manage roles
app.get('/api/v1/admin/roles', authService.onlyAdmin, adminRolesController.getMany);
app.post('/api/v1/admin/roles', authService.onlyAdmin, adminRolesController.createOne);
app.put('/api/v1/admin/roles', authService.onlyAdmin, adminRolesController.updateMany);
app.delete('/api/v1/admin/roles', authService.onlyAdmin, genericController.response405);

app.get('/api/v1/admin/roles/:id', authService.onlyAdmin, adminRolesController.getOne);
app.post('/api/v1/admin/roles/:id', authService.onlyAdmin,genericController.response405);
app.put('/api/v1/admin/roles/:id', authService.onlyAdmin, adminRolesController.updateOne);
app.delete('/api/v1/admin/roles/:id', authService.onlyAdmin, adminRolesController.deleteOne);


//manage users
app.get('/api/v1/admin/users', authService.onlyAdmin, adminUserController.getUsers);
app.post('/api/v1/admin/users', authService.onlyAdmin, adminUserController.createUser);
app.put('/api/v1/admin/users', authService.onlyAdmin, adminUserController.updateUsers);
app.delete('/api/v1/admin/users', authService.onlyAdmin, genericController.response405);

app.get('/api/v1/admin/users/:id', authService.onlyAdmin, adminUserController.getUser);
app.post('/api/v1/admin/users/:id', authService.onlyAdmin,genericController.response405);
app.put('/api/v1/admin/users/:id', authService.onlyAdmin, adminUserController.updateUser);
app.delete('/api/v1/admin/users/:id', authService.onlyAdmin, adminUserController.deleteUser);

//manage user permissions: only get, post, or delete
// app.get('/api/v1/admin/users/:id/permissions');
// app.put('/api/v1/admin/users/:id/permissions');
// app.delete('/api/v1/admin/users/:id/permissions/:permissionId')

//manage user roles: only get, post, or delete
// app.get('/api/v1/admin/users/:id/roles');
// app.post('/api/v1/admin/users/:id/roles');
// app.delete('/api/v1/admin/users/:id/roles/:roleId')

//manage user notifications: only get, put, or delete
//I need to also reset the list of unseen.
// app.get('/api/v1/admin/users/:id/notifications');
// app.put('/api/v1/admin/users/:id/notifications/:notificationId');
// app.delete('/api/v1/admin/users/:id/notifications/:notificationId');

//manage user profile: only put or get
// app.get('/api/v1/admin/users/:id/notifications');
// app.put('/api/v1/admin/users/:id/notifications/:notificationId');
// app.delete('/api/v1/admin/users/:id/notifications/:notificationId');




//////////////////////////////////////////////////////////////
// Admin Above
// ===========================================================
// Courses Below
//////////////////////////////////////////////////////////////
// app.get('/api/v1/organization/courses', authService.permissions(["cool", "blah"], "asdf"), courseController.getCourses);
app.get('/api/v1/organization/courses', authService.permissions("Bobby"), courseController.getCourses);
app.post('/api/v1/organization/courses', courseController.createCourse);
app.put('/api/v1/organization/courses', courseController.updateCourses);
app.delete('/api/v1/organization/courses', courseController.deleteCourses);

app.get('/api/v1/organization/courses/:id', courseController.getCourse);
app.post('/api/v1/organization/Courses/:id', genericController.response405);
app.put('/api/v1/organization/courses/:id', courseController.updateCourse);
app.delete('/api/v1/organization/courses/:id', courseController.deleteCourse);




//////////////////////////////////////////////////////////////
// Courses Above
// ===========================================================

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
