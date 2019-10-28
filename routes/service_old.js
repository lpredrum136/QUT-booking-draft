const express = require('express');
const router = express.Router();
const request = require('request');
const authHelper = require('../helpers/auth');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

router.get('/create', async (req, res, next) => {
  let parms = {
    title: 'Create Service',
    active: {
      createService: true
    }
  };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  const biz_id = 'QUTBooking2@qutbooking.onmicrosoft.com';

  if (accessToken && userName) {
    parms.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: done => {
        done(null, accessToken);
      }
    });

    let res = await client
      .api('/bookingBusinesses/QUTLunch@M365B489948.onmicrosoft.com/publish')
      .version('beta')
      .post();

    const bookingService = {
      defaultDuration: 'PT1H30M',
      defaultLocation: {
        address: {
          city: 'Brisbane',
          countryOrRegion: 'AUS',
          postalCode: '4000',
          state: 'QLD',
          street: '4567 George Street'
        },
        displayName: 'QUT Lunch Box'
      },
      defaultPrice: 10.0,
      defaultPriceType: 'fixedPrice'
    };

    let res = await client
      .api('/bookingBusinesses/QUTLunch@M365B489948.onmicrosoft.com/services')
      .version('beta')
      .post(bookingService);

    try {
      // Get the first 10 events for the coming week
      const result = await client
        .api(`/bookingBusinesses/${biz_id}/services`)
        .version('beta')
        .post(bookingService);

      parms.debug = `Returned: ${JSON.stringify(result, null, 2)}`;
    } catch (err) {
      parms.message = 'Error retrieving calendar events';
      parms.error = {
        status: `${err.code}: ${err.message}`
      };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }
  } else {
    // Redirect to home
    res.redirect('/');
  }

  res.render('index', parms);
});

module.exports = router;
