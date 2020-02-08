const jwt = require('jsonwebtoken');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';


exports.issue = (payload) => {
  var tokenDurationInMilis = 60000,
      now = new Date(),
      tokenIssuedDate = now.toUTCString(),
      tokenExpiredDate = new Date(now.getTime() + tokenDurationInMilis).toUTCString();

  return {
    token: jwt.sign(payload, secret, { expiresIn: tokenDurationInMilis}),
    tokenIssuedDate: tokenIssuedDate,
    tokenExpiredDate: tokenExpiredDate
  } 
}

exports.verify = (token, cb) => jwt.verify(token, secret, {}, cb);






// const authService = () => {
//   const issue = (payload) => jwt.sign(payload, secret, { exp: Math.floor(Date.now() / 1000) + (60 * 60) });
//   const verify = (token, cb) => jwt.verify(token, secret, {}, cb);

//   return {
//     issue,
//     verify,
//   };
// };

// module.exports = authService;
