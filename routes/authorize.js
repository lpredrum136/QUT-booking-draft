var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

/* GET /authorize */
router.get('/', async (req, res, next) => {
  // Get auth code
  const code = req.query.code;

  // If code is present, use it
  if (code) {
    let token;

    try {
      token = await authHelper.getTokenFromCode(code, res);
      // Redirect to home
      //res.redirect('/');
      //res.json(token);
      res.redirect('http://localhost:5000');
    } catch (error) {
      res.render('error', {
        title: 'Error',
        message: 'Error exchanging code for token',
        error: error
      });
    }
  } else {
    // Otherwise complain
    res.render('error', {
      title: 'Error',
      message: 'Authorization error',
      error: {
        status: 'Missing code parameter'
      }
    });
  }
});

/* GET /authorize/signout */
router.get('/signout', (req, res, next) => {
  console.log('receive call from action');
  authHelper.clearCookies(res);

  // Redirect to home
  res.redirect('http://localhost:5000/');
});

module.exports = router;
