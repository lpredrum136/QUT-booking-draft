const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/auth');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const mongoose = require('mongoose');
const moment = require('moment-business-days');
const bodyParser = require('body-parser');
const findDays = require('../helpers/findDays'); // Helpers to find days for a service

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Load Business Model
require('../models/Business');
const Business = mongoose.model('businesses');

let parms = {};

// CREATE BOOKING
router.get('/create/:id', async (req, res, next) => {
  User.findOne({
    email: req.params.id
  }).then(async user => {
    //parms.days = ['2019-10-08', '2019-10-09', '2019-10-10'];
    let parms = {};
    parms.email = req.params.id;

    const refresh_token = user.refreshtoken;

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

    const newToken = await oauth2.accessToken
      .create({
        refresh_token: refresh_token
      })
      .refresh();

    authHelper.saveValuesToCookie(newToken, res);

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: done => {
        done(null, newToken.token.access_token);
      }
    });

    Business.find({
      email: req.params.id
    }).then(businesses => {
      parms.businesses = businesses;
      //res.render('events/add', parms);
      res.json(parms);
    });

    /*try {
      const event = {
        subject: "Let's go for lunch",
        body: {
          contentType: 'HTML',
          content: 'Does late morning work for you?'
        },
        start: {
          dateTime: '2019-10-08T15:00:00',
          timeZone: 'Australia/Brisbane'
        },
        end: {
          dateTime: '2019-10-08T16:00:00',
          timeZone: 'Australia/Brisbane'
        },
        location: {
          displayName: "Harry's Bar"
        },
        attendees: [
          {
            emailAddress: {
              address: 'samanthab@contoso.onmicrosoft.com',
              name: 'Samantha Booth'
            },
            type: 'required'
          }
        ]
      };

      let result = await client.api('/me/events').post(event);

      res.send(result);
      parms.debug = `Returned: ${JSON.stringify(result, null, 2)}`;
    } catch (err) {
      parms.message = 'Error adding events';
      parms.error = {
        status: `${err.code}: ${err.message}`
      };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }*/
  });
});

// ENDPOINT POST TO GET FREE DAYS
router.post('/getdays', async (req, res, next) => {
  const service = req.body.service;
  const email = req.body.email;
  console.log(service);
  console.log(email);
  if (service && email) {
    const business = await Business.findOne({ name: service });

    // days below is a load of moment objects
    /*const days = findDays(
      business.minLead,
      business.maxLead,
      business.defaultHour * 60 + business.defaultMin
    );*/

    const days = findDays(
      business.minLead,
      business.maxLead,
      business.defaultHour * 60 + business.defaultMin,
      business.endTime
    );

    // Construct the response_days
    const formatted_days = days.map(day => day.format('ddd D/MM'));
    const raw_days = days.map(day => day.format());

    const response_days = [];
    for (let i = 0; i < days.length; i++) {
      response_days[i] = {
        day: raw_days[i],
        formatted_day: formatted_days[i]
      };
    }

    // START AUTH
    const user = await User.findOne({ email: email });
    const refresh_token = user.refreshtoken;

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

    const newToken = await oauth2.accessToken
      .create({
        refresh_token: refresh_token
      })
      .refresh();

    authHelper.saveValuesToCookie(newToken, res);

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: done => {
        done(null, newToken.token.access_token);
      }
    });
    // END AUTH

    // START GENERATING FREE SLOTS FOR EACH DAY

    // Calculate slots_required
    let interval = business.defaultHour * 60 + business.defaultMin;
    let slots_required = interval / 15;

    // Now we start
    for (let i = 0; i < days.length; i++) {
      try {
        let original_user_startTime;
        let user_startTime;
        let user_endTime = `${moment(response_days[i].day).format(
          'YYYY-MM-DD'
        )}T${business.endTime}:00`;

        // If it's today then start time is now, else it's the startTime of business
        if (moment(response_days[i].day).isSame(moment(), 'day')) {
          original_user_startTime = moment().roundNext15Min();
          user_startTime = original_user_startTime.format(
            'YYYY-MM-DDTHH:mm:ss'
          );
        } else {
          original_user_startTime = moment(
            `${moment(response_days[i].day).format('YYYY-MM-DD')}T${
              business.startTime
            }:00`
          );
          user_startTime = `${moment(response_days[i].day).format(
            'YYYY-MM-DD'
          )}T${business.startTime}:00`;
        }

        // Start query to MS
        const scheduleInformation = {
          schedules: [email],
          startTime: {
            dateTime: user_startTime,
            timeZone: 'Australia/Brisbane'
          },
          endTime: {
            dateTime: user_endTime,
            timeZone: 'Australia/Brisbane'
          },
          availabilityViewInterval: 15
        };

        // Get back the busy slots
        let busy_slots = await client
          .api('/me/calendar/getSchedule')
          .header('Prefer', 'outlook.timezone="Australia/Brisbane"')
          .post(scheduleInformation);

        // Availability view 000222..
        let scheduled_items = busy_slots.value[0].availabilityView;

        // Start generating
        let available_slots = [];
        let slots_taken = 0;
        let current = null;

        for (let i = 0; i < scheduled_items.length; i++) {
          if (scheduled_items[i] == 0) {
            slots_taken++;
            if (current == null) {
              current = original_user_startTime.clone().add(i * 15, 'm');
            }
            if (slots_taken == slots_required) {
              available_slots.push(current.format());
              current = original_user_startTime.clone().add((i + 1) * 15, 'm');
              slots_taken = 0;
            }
          } else {
            slots_taken = 0; // get broken
            current = null;
          }
        }

        // Finally, add it to each day in response_days
        response_days[i].free_slots = available_slots;
      } catch (error) {
        console.log(error.message);
      }
    }

    res.json({ days: response_days });
  } else res.redirect('/');
});

// SUBMIT FORM TO BOOK APPOINTMENT
router.post('/create', async (req, res, next) => {
  const subject = req.body.subject;
  const message = req.body.message;
  const name = req.body.name;
  const client_email = req.body.client_email;
  const business = req.body.business;
  const time = req.body.time;
  const owner_email = req.body.owner_email;

  // START AUTH
  const user = await User.findOne({ email: owner_email });
  const refresh_token = user.refreshtoken;

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

  const newToken = await oauth2.accessToken
    .create({
      refresh_token: refresh_token
    })
    .refresh();

  authHelper.saveValuesToCookie(newToken, res);

  // Initialize Graph client
  const client = graph.Client.init({
    authProvider: done => {
      done(null, newToken.token.access_token);
    }
  });
  // END AUTH

  // MAKE BOOKING TO MS SERVER
  try {
    const event = {
      subject: `${business.name}: ${subject}`,
      body: {
        contentType: 'HTML',
        content: message
      },
      start: {
        dateTime: moment(time).format('YYYY-MM-DDTHH:mm:ss'),
        timeZone: 'Australia/Brisbane'
      },
      end: {
        dateTime: moment(time)
          .clone()
          .add(business.defaultHour * 60 + business.defaultMin, 'm')
          .format('YYYY-MM-DDTHH:mm:ss'),
        timeZone: 'Australia/Brisbane'
      },
      location: {
        displayName: business.address
      },
      attendees: [
        {
          emailAddress: {
            address: client_email,
            name: name
          },
          type: 'required'
        }
      ]
    };

    let result = await client.api('/me/events').post(event);

    res.json(result);
  } catch (err) {
    console.error(err.message);
  }
});

// HELPER FUNCTION TO ROUND TO 15 MINS
moment.fn.roundNext15Min = function() {
  let intervals = Math.floor(this.minutes() / 15);
  if (this.minutes() % 15 != 0) intervals++;
  if (intervals == 4) {
    this.add('hours', 1);
    intervals = 0;
  }
  this.minutes(intervals * 15);
  this.seconds(0);
  return this;
};

//=================

module.exports = router;
