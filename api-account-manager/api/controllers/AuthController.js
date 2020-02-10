const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const utils = require('../utils');


exports.register = async (req, res) => {
  const { body } = req;
  try {
    if (body === null || body === undefined) {
      return res.status(400).json({ 
        msg: 'Bad Request: Body was not present.', 
        humanMsg: 'Please enter a password for your account' 
      });
    }
    
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ 
        msg: 'Bad Request: Body was not present.', 
        humanMsg: 'Please enter a password for your account' 
      });
    }
    
    let isAdmin = false;
    const userCount = await User.count();
    const doesUserEmailExist = await User.findOne({where:{
      email: body.email
    }});
    
    if (userCount === 0) {
      isAdmin = true;
    }

    if (doesUserEmailExist){
      return res.status(409).json({
        "msg": "Conflict: User email already has existing email",
        "humanMsg": "This email has already been register."
      });
    }


    if (body.password === undefined || body.password === null) {
      return res.status(400).json({ 
        msg: 'Bad Request: Password is missing.', 
        humanMsg: 'Please enter a password for your account' 
      });
    }

    if (body.password.length < 6) {
      return res.status(400).json({ 
        msg: 'Bad Request: Password is missing.',
        humanMsg: 'Your password needs to be at least 6 letters.' 
      });
    }

    const user = await User.create({
      email: body.email,
      password: body.password,
      isAdmin: isAdmin
    });
    const tokenResult = authService.issue({ id: user.id });

    return res.status(201).json({ 
      token: tokenResult.token,
      tokenIssuedDate: tokenResult.tokenIssuedDate,
      tokenExpiredDate: tokenResult.tokenExpiredDate,
      userId: user.id
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ 
        msg: 'Bad Request: Email and password required.', 
        humanMsg: 'Please enter your account information' 
      });
    }
  
    const user = await User
      .findOne({
        where: {
          email
        },
      });


    if (!user) {
      return res.status(400).json({ 
        msg: 'Bad Request: User not found',
        humanMsg: 'No account exist with this email.'
      });
    }
  

    if (user.isBanned) {
      return res.status(403).json({ 
        msg: 'Forbidden: User has been banned.',
        humanMsg: 'This account is suspended.'
      });
    }

    if (user.isDisabled) {
      return res.status(401).json({ 
        msg: 'Unauthorized: User account is disabled.',
        humanMsg: 'This account is disabled.',
        resolve: '/api/v1/reactivate/email'
      });
    }

    if (bcryptService().comparePassword(password, user.password)) {
      const tokenResult = authService.issue({ id: user.id });

      return res.status(200).json({ 
        token: tokenResult.token,
        tokenIssuedDate: tokenResult.tokenIssuedDate,
        tokenExpiredDate: tokenResult.tokenExpiredDate,
        userId: user.id
      });
    }

    return res.status(401).json({ 
      msg: 'Unauthorized' 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }

  return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
};

exports.validateToken = (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ 
        msg: 'Bad Request: The body should contain a token.' 
      });
    }

    authService.verify(token, (err) => {
      if (err) {
        return res.status(200).json({ isValid: false });
      }

      return res.status(200).json({ isValid: true });
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;

  try{
    authService.verify(token, (err, decodedToken) => {
      if (err && err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Unauthorized: Token has expired.' });
      }
      if (err && err.name === 'JsonWebTokenError') {
        return res.status(400).json({ msg: 'Bad Request: Token is invalid.' });
      }

      //catch all
      if (err) {
        return res.status(500).json({ msg: 'Internal server error' });
      }

      delete decodedToken.iat;
      delete decodedToken.exp;
      
      const tokenResult = authService.issue(decodedToken);

      return res.status(200).json({ 
        token: tokenResult.token,
        tokenIssuedDate: tokenResult.tokenIssuedDate,
        tokenExpiredDate: tokenResult.tokenExpiredDate,
        userId: decodedToken.id
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  try{
    if (!email) {
      return res.status(400).json({ 
        msg: 'Bad Request: Email required.', 
        humanMsg: 'Please enter your email.' 
      });
    }

    if (!utils.StringValidation.email(email)) {
      return res.status(400).json({ 
        msg: 'Bad Request: Email not a valid email.', 
        humanMsg: 'Please enter a valid email.' 
      });
    }

    //email service with forgot password link.

    return res.status(200).json({ 
      msg: "Email has been sent",
      humanMsg: "Email has been sent."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}

exports.disable = (req, res) => {

}

exports.reactivate = (req, res) => {

}


// exports.getAll = async (req, res) => {
//   try {
//     const users = await User.findAll();

//     return res.status(200).json({ users });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: 'Internal server error' });
//   }
// };

// exports.test = async (req, res) => {
//   try {

//     return res.status(200).json({asdf: "Hi, from api"});
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: 'Internal server error' });
//   }
// };

