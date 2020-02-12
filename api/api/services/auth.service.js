const Sequalize = require('sequelize');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const User = require('../models/User');

const secret = process.env.TOKEN_SECRET || 'secret';

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
    const { token } = req.body,
      { excludedRoutes } = options,
      { originalUrl } = req;

    try {
      console.log("excluded url: ", originalUrl, excludedRoutes)
      for (var i = 0; i < excludedRoutes.length; i++) {
        console.log("result: ", utils.StringValidation.wildTest(excludedRoutes[i], originalUrl, excludedRoutes[i]))
        if (utils.StringValidation.wildTest(excludedRoutes[i], originalUrl)) {

          //This route doesn't required a token.
          next();
          return;
        }
      }

      if (!token) {
        return res.status(400).json({
          msg: 'Bad Request: The body should contain a token.'
        });
      }

      this.verify(token, (err, decodedToken) => {
        if (err && err.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: 'Unauthorized: Token has expired.' });
        }
        if (err && err.name === 'JsonWebTokenError') {
          return res.status(400).json({ msg: 'Bad Request: Token is invalid.' });
        }

        req.token = token;
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
let isTableInstalled = false,
  knownRoles = {}; //used like an array but bracket notification. 

exports.onlyAdmin = async (req, res, next) => {
  const userId = req.decodedToken.id;

  const user = await User
    .findOne({
      where: {
        id: userId
      },
    });

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

}

exports.permissions = (...theArgs) => {

  return async (req, res, next) => {
    try {



      // Check if permissions and roles table has been installed
      if (!isTableInstalled) {
        const doesPermissionsTableExist = await sequelize.query("\
                              SELECT count(*) FROM information_schema.TABLES\
                              WHERE (TABLE_NAME = 'permissions')");

        const doesRolesTableExist = await sequelize.query("\
                              SELECT count(*) FROM information_schema.TABLES\
                              WHERE (TABLE_NAME = 'permissions')");

        if (!doesPermissionsTableExist) {
          await sequelize.query("CREATE TABLE `lms`.`permissions` ( `user_id` INT NOT NULL )");
        }

        if (!doesRolesTableExist) {
          await sequelize.query("CREATE TABLE `lms`.`roles` ( `user_id` INT NOT NULL )");
        }

        isTableInstalled = true;
      }

      // check is params have been install as columns.
      for (var i = 0; i < theArgs.length; i++) {
        if (theArgs[i] instanceof Array) {
          for (var x = 0; x < theArgs[i].length; x++) {
            const doesColumnExist = knownRoles[theArgs[i][x]];

            if (!doesColumnExist) {
              // if collumns haven't, then install them in permissions and roles.
              await installColumn(theArgs[i][x]);
            }
          }

          //string
        } else if (typeof (theArgs[i]) === "string") {
          const doesColumnExist = knownRoles[theArgs[i]];

          if (!doesColumnExist) {
            // if collumns haven't, then install them in permissions and roles.
            await installColumn(theArgs[i]);
          }
        } else {
          throw 'Function "permissions" on object "AuthService" only takes string and array as arguments.';
        }

      }

      // Check if user is admin.
      const user = await User.findOne({
        where: {
          email: body.email
        }
      });

      if (user.isAdmin) {
        return next();
      }

      // Pull permissions and roles tables from token.
      const userPermissions = await sequelize.query("\
        SELECT * FROM `lms`.`permissions` WHERE `user_id` = ?",
        { replacements: [token.decodedToken.id], type: sequelize.QueryTypes.SELECT });

      const userRoles = await sequelize.query("SELECT * FROM `lms`.`roles` WHERE `user_id` = ?",
        { replacements: [token.decodedToken.id], type: sequelize.QueryTypes.SELECT });

      const userRolesPermissions = await sequelize.query("\
        SELECT * FROM `lms`.`roles` WHERE `user_id` = ?",
        { replacements: [token.decodedToken.id], type: sequelize.QueryTypes.SELECT });

      let roles = [];


      // check if user has permissions.

      // for (var i = 0; i < theArgs.length; i++) {

      //   console.log("Arg:", theArgs[i], theArgs[i] instanceof Array);
      // }
      next();

    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

}
