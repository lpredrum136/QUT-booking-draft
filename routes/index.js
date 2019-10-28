var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  let parms = {
    title: 'QUT Booking',
    active: {
      home: true
    }
  };

  if (accessIdentity) {
    // Successfully login
    parms.user = accessIdentity.username;
    //parms.debug = `User: ${accessIdentity.username}\nAccess Token: ${accessIdentity.access_token}`;
    parms.email = accessIdentity.email;
    //parms.access_token = accessIdentity.access_token;
  } else {
    parms.signInUrl = authHelper.getAuthUrl();
    parms.debug = parms.signInUrl;
  }

  //res.render('index/welcome', parms);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.json(parms);
});

module.exports = router;
