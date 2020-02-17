const database = require('../../config/databases');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const User = require('../models/User');

const secret = process.env.TOKEN_SECRET || 'secret';
const db = database.lms;

//////////////////////////////////////////////////////////////
// TOKEN Below
// ===========================================================

exports.issue = (payload) => {
  var tokenDurationInMilis = (process.env.TOKEN_EXPIRE_MILISECONDS ? parseInt(process.env.TOKEN_EXPIRE_MILISECONDS) : undefined) || 60000,
    now = new Date(),
    tokenIssuedDate = now.toUTCString(),
    tokenExpiredDate = new Date(now.getTime() + tokenDurationInMilis).toUTCString();

  return {
    token: jwt.sign(payload, secret, { expiresIn: tokenDurationInMilis }),
    tokenIssuedDate: tokenIssuedDate,
    tokenExpiredDate: tokenExpiredDate
  }
}

exports.verify = (token, cb) => jwt.verify(token, secret, {}, cb);

exports.tokenMiddleware = (options) => {
  return (req, res, next) => {
    let tokenToVerify,
      { excludedRoutes } = options,
      { originalUrl } = req;

    try {
      for (var i = 0; i < excludedRoutes.length; i++) {
        if (utils.StringValidation.wildTest(excludedRoutes[i], originalUrl)) {

          //This route doesn't required a token.
          next();
          return;
        }
      }

      if (req.header('Authorization')) {
        const parts = req.header('Authorization').split(' ');

        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];

          if (/^Bearer$/.test(scheme)) {
            tokenToVerify = credentials;
          } else {
            return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
          }
        } else {
          return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
        }
      } else if (req.body.token) {
        tokenToVerify = req.body.token;
        delete req.query.token;
      } else {
        return res.status(401).json({ msg: 'No Authorization was found' });
      }


      this.verify(tokenToVerify, (err, decodedToken) => {
        if (err && err.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: 'Unauthorized: Token has expired.' });
        }
        if (err && err.name === 'JsonWebTokenError') {
          return res.status(400).json({ msg: 'Bad Request: Token is invalid.' });
        }

        req.token = tokenToVerify;
        req.decodedToken = decodedToken;
        next();
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }
}

//////////////////////////////////////////////////////////////
// TOKEN Above
// ===========================================================
// Authorization below
//////////////////////////////////////////////////////////////
let areTablesInstalled = false,
  hasLoadedColumnNames = false,
  knownPermissions = {}; //used like an array but bracket notification. 

exports.onlyAdmin = async (req, res, next) => {
  const userId = req.decodedToken.id;

  const user = await User
    .findOne({
      where: {
        id: userId
      },
    });

  req.user = user;

  if (!user) {
    // Tigger here in future.
    return res.status(401).json({
      msg: 'Unauthorized.',
      humanMsg: 'You don\'t the necessary permission(s).',
      resolve: {
        role: "Admin"
      }
    });
  }

  if (user.isAdmin) {
    next()
  } else {
    return res.status(401).json({
      msg: 'Unauthorized.',
      humanMsg: 'You don\'t the necessary permission(s).',
      resolve: {
        role: "Admin"
      }
    });
  }
}

const installColumn = async (columnName) => {

  //alter permissions and roles to have permission as column with default false not null
  await db.query(`ALTER TABLE permissions ADD COLUMN ${columnName} BOOLEAN NOT NULL DEFAULT 0;`);
  await db.query(`ALTER TABLE roles ADD COLUMN ${columnName} BOOLEAN NOT NULL DEFAULT 0;`);
}

exports.permissions = (...theArgs) => {

  return async (req, res, next) => {
    try {

      // Check if permissions and roles table has been installed
      if (!areTablesInstalled) {
        const doesPermissionsTableExist = await db.query("\
                              SELECT count(*) as result FROM information_schema.TABLES\
                              WHERE (TABLE_NAME = 'permissions')",
          { type: Sequelize.QueryTypes.SELECT });

        const doesRolesTableExist = await db.query("\
                              SELECT count(*) as result FROM information_schema.TABLES\
                              WHERE (TABLE_NAME = 'roles')",
          { type: Sequelize.QueryTypes.SELECT });

        const doesUsersRolesTableExist = await db.query("\
                              SELECT count(*) as result FROM information_schema.TABLES\
                              WHERE (TABLE_NAME = 'users_roles')",
          { type: Sequelize.QueryTypes.SELECT });

        if (!doesPermissionsTableExist[0].result) {
          await db.query("CREATE TABLE `permissions` ( `id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , PRIMARY KEY (`id`))");
        }

        if (!doesRolesTableExist[0].result) {
          await db.query("CREATE TABLE `roles` ( `id` INT NOT NULL AUTO_INCREMENT , `name` TINYTEXT NOT NULL , PRIMARY KEY (`id`))");
        }

        if (!doesUsersRolesTableExist[0].result) {
          await db.query("CREATE TABLE `users_roles` ( `id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `role_id` INT NOT NULL , PRIMARY KEY (`id`))");
        }

        areTablesInstalled = true;
      }

      //save all column names
      if (!hasLoadedColumnNames) {
        const permissionsColumnNames = await db.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'permissions'");

        for (var i = 0; i < permissionsColumnNames[0].length; i++) {
          knownPermissions[permissionsColumnNames[0][i].COLUMN_NAME] = true;
        }

        hasLoadedColumnNames = true;
      }

      // check if params have been install as columns.
      for (var i = 0; i < theArgs.length; i++) {
        const doesColumnExist = knownPermissions[theArgs[i]];

        if (!doesColumnExist) {
          // if collumns haven't, then install them in permissions and roles.
          await installColumn(theArgs[i]);
        }
      }

      // Check if user is admin.
      const user = await User.findOne({
        where: {
          id: req.decodedToken.id
        }
      });

      req.user = user;

      if (user.isAdmin) {
        return next();
      }

      // Pull permissions and roles tables from token.
      const userPermissions = (await db.query(`SELECT * FROM permissions WHERE user_id = ${req.decodedToken.id}`, { raw: true, type: Sequelize.QueryTypes.SELECT }))[0],
        userRoles = (await db.query(`SELECT * FROM users_roles LEFT JOIN roles on roles.id = users_roles.role_id  WHERE users_roles.user_id = ${req.decodedToken.id}`, { raw: true, type: Sequelize.QueryTypes.SELECT }));


      // check if params have been install as columns.
      loop_argument:
      for (var i = 0; i < theArgs.length; i++) {
        //user permissions matches permission required to go to route.
        if (userPermissions[theArgs[i]]) {
          return next();
        }

        //user roles matches permission required to go to routes.
        loop_roles:
        for (var x = 0; x < userRoles.length; x++) {
          if (userRoles[x][theArgs[i]]) {
            return next();
          }
        }
      }
      
      return res.status(401).json({
        msg: 'No Authorization was found'
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

}
