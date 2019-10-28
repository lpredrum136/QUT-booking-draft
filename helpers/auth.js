const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// GET ACCESS CODE
const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};

const oauth2 = require('simple-oauth2').create(credentials);

const getAuthUrl = () => {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });

  //console.log(`GENERATED AUTH URL: ${returnVal}`);
  return returnVal;
};

exports.getAuthUrl = getAuthUrl;

// GET TOKEN FROM CODE
const getTokenFromCode = async (auth_code, res) => {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });

  const token = oauth2.accessToken.create(result);
  /*console.log('=======TOKEN CREATED:');
    console.log(token.token);
    console.log('=====TEST STRINGIFY')
    console.log(JSON.stringify(token));*/

  // Store token in a session cookie. Also get the logged in user's name
  // Save the token and username in the session
  saveValuesToCookie(token, res);

  return token.token.access_token;
};

exports.getTokenFromCode = getTokenFromCode;

// SAVE VALUES TO COOKIE METHOD
const saveValuesToCookie = (token, res) => {
  // Parse the identity token
  const user_outlook = jwt.decode(token.token.id_token);
  /*console.log('========THIS IS TOKEN.TOKEN.ID_TOKEN:');
    console.log(user_outlook);*/

  // Save in db
  // Check if user already there? Yes: Update, No: Add
  User.findOne({
    email: user_outlook.preferred_username
  }).then(user => {
    if (user) {
      console.log('FOUND HIM');
      user.accesstoken = token.token.access_token;
      user.refresh_token = token.token.refresh_token;
      user.expire = token.token.expires_at.getTime();

      user.save().then(user => {
        return;
      });
    } else {
      const newUser = {
        name: user_outlook.name,
        email: user_outlook.preferred_username, // This is unique
        accesstoken: token.token.access_token,
        refreshtoken: token.token.refresh_token,
        expire: token.token.expires_at.getTime()
      };

      new User(newUser)
        .save()
        .then(user => {
          return;
        })
        .catch(err => {
          console.log(`ERROR ADDING USER TO DB: ${err}`);
          return;
        });
    }
  });

  // Save user info in a cookie
  res.cookie('graph_user_name', user_outlook.name, {
    maxAge: 3600000,
    httpOnly: false
  });

  res.cookie('graph_email', user_outlook.preferred_username, {
    maxAge: 3600000,
    httpOnly: false
  });

  res.cookie('graph_access_token', token.token.access_token, {
    maxAge: 3600000,
    httpOnly: false
  });

  // Save the refresh token in a cookie
  res.cookie('graph_refresh_token', token.token.refresh_token, {
    //maxAge: 7200000,
    expires: new Date(2147483647000), // So it never expires
    httpOnly: false
  });

  // Save the token expiration time in a cookie
  res.cookie('graph_token_expires', token.token.expires_at.getTime(), {
    maxAge: 3600000,
    httpOnly: false
  });

  /*console.log('========THIS IS EXPIRE TIME');
    console.log(token.token.expires_at);
    console.log(token.token.expires_in);
    console.log(token.token.expires_at.getTime());*/
};

exports.saveValuesToCookie = saveValuesToCookie;

// CLEAR COOKIES TO ASSIST LOGOUT
const clearCookies = res => {
  // Clear cookies

  res.clearCookie('graph_user_name', {
    maxAge: 3600000,
    httpOnly: false
  });

  res.clearCookie('graph_email', {
    maxAge: 3600000,
    httpOnly: false
  });

  res.clearCookie('graph_access_token', {
    maxAge: 3600000,
    httpOnly: false
  });

  res.clearCookie('graph_refresh_token', {
    //maxAge: 7200000,
    expires: new Date(2147483647000),
    httpOnly: false
  });

  res.clearCookie('graph_token_expires', {
    maxAge: 3600000,
    httpOnly: false
  });
};

exports.clearCookies = clearCookies;

// RETRIEVE THE CACHED TOKEN, CHECK IF IT IS EXPIRED, AND REFRESH IF IT IS
const getAccessToken = async (cookies, res) => {
  // Do we have access token cached
  let token = cookies.graph_access_token;

  // Check
  if (token) {
    // We have a token but has it expired
    // Expires 5 mins early to account for clock differences
    const FIVE_MINUTES = 300000;
    const expiration = new Date(
      parseFloat(cookies.graph_token_expires - FIVE_MINUTES)
    );

    if (expiration > new Date()) {
      // Expiration time is after current time
      // Token is still good
      const result = {
        access_token: token,
        username: cookies.graph_user_name,
        email: cookies.graph_email
      };
      return result;
    }
  }

  // No token or it's expired, do we have a refresh token
  const refresh_token = cookies.graph_refresh_token;
  if (refresh_token) {
    const newToken = await oauth2.accessToken
      .create({
        refresh_token: refresh_token
      })
      .refresh();

    // Save the new token to cookie.
    // If you go back to the function definition, all the important info are saved in cookies again
    saveValuesToCookie(newToken, res);

    var result = {
      access_token: newToken.token.access_token,
      username: newToken.token.id_token.name,
      email: newToken.token.id_token.preferred_username
    };

    return result;
  }

  // Test find in db

  // Nothing in the cookies that helps, return empty
  return null;
};

exports.getAccessToken = getAccessToken;
