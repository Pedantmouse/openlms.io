const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

exports.register = async (req, res) => {
  const { body } = req;
  // console.log(body);

  if (body.password !== undefined && body.password !== null && body.password !== "" && body.password === body.password2) {
    try {
      const user = await User.create({
        email: body.email,
        password: body.password,
      });
      const tokenResult = authService.issue({ id: user.id });

      return res.status(200).json({ 
        token: tokenResult.token,
        tokenIssuedDate: tokenResult.tokenIssuedDate,
        tokenExpiredDate: tokenResult.tokenExpiredDate,
        user_id: user.id
       });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await User
        .findOne({
          where: {
            email,
          },
        });

      if (!user) {
        return res.status(400).json({ msg: 'Bad Request: User not found' });
      }

      if (bcryptService().comparePassword(password, user.password)) {
        const token = authService.issue({ id: user.id });

        return res.status(200).json({ token, user });
      }

      return res.status(401).json({ msg: 'Unauthorized' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
};

exports.validate = (req, res) => {
  const { token } = req.body;

  authService.verify(token, (err) => {
    if (err) {
      return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
    }

    return res.status(200).json({ isvalid: true });
  });
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.test = async (req, res) => {
  try {

    return res.status(200).json({asdf: "Hi, from api"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

