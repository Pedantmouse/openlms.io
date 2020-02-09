const jwt = require('jsonwebtoken');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';


exports.issue = (payload) => {
  var tokenDurationInMilis = (process.env.TOKEN_EXPIRE_MILISECONDS ? parseInt(process.env.TOKEN_EXPIRE_MILISECONDS) : undefined) || 60000,
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

exports.tokenMiddleware = (options) => {
  return (req, res, next) => {
    const { token } = req.body,
          { excludedRoutes } = options,
          { path } = req.route;

    try {
      // https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
      function wildTest(wildcard, str) {
        const re = new RegExp(`^${wildcard.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
        return re.test(str); // remove last 'i' above to have case sensitive
      }
      
      for(var i = 0; i < excludedRoutes.length; i++) {
        if(wildTest(path, excludedRoutes[i])) {
          
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