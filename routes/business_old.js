const express = require('express');
const router = express.Router();
//const request = require('request');
const authHelper = require('../helpers/auth');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const mongoose = require('mongoose');

// Load Business Model
require('../models/Business');
const Business = mongoose.model('businesses');

// LIST
router.post('/list', async (req, res, next) => {
  /*const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    let parms = {
      title: 'All services',
      active: {
        business: true
      },
      user: accessIdentity.username
    };

    // Get all businesses
    Business.find({
      email: accessIdentity.email
    }).then(businesses => {
      parms.businesses = businesses;
      res.render('businesses/index', parms);
    });
  } else {
    res.redirect('/');
  }*/

  Business.find({
    email: req.body.email
  }).then(businesses => {
    //res.render('businesses/index', parms);
    res.json(businesses);
  });
});

// EDIT /GET
router.get('/edit/:id', async (req, res, next) => {
  /*const id = req.params.id;
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    const email = accessIdentity.email;

    let parms = {
      title: 'QUT Booking - Edit Your Business',
      active: {
        business: true
      },
      user: accessIdentity.username
    };

    Business.findOne({
      _id: id
    }).then(business => {
      if (business.email != email) {
        res.redirect('/businesses/list');
      } else {
        parms.business = business;
        res.render('businesses/edit', parms);
      }
    });
  } else {
    res.redirect('/');
  }*/

  const one_business = await Business.findById(req.params.id);
  if (one_business) res.json(one_business);
  else res.status(404).json({ msg: 'No Business found' });
});

// EDIT /PUT
router.put('/edit/:id', async (req, res, next) => {
  /*const id = req.params.id;
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);*/

  /*if (accessIdentity) {
    Business.findOne({
      _id: id
    }).then(business => {
      // Special check for boolean var (checkbox in html)
      let allowBuffer;
      if (req.body.bufferSwitch) allowBuffer = true;
      else allowBuffer = false;

      let publish;
      if (req.body.publish) publish = true;
      else publish = false;

      let staff;
      if (req.body.staff) staff = true;
      else staff = false;

      // New values
      business.name = req.body.name;
      business.address = req.body.address;
      business.phone = req.body.phone;
      business.desc = req.body.desc;
      business.website = req.body.website;
      business.defaultHour = req.body.defaultHour;
      business.defaultMin = req.body.defaultMin;
      business.buffer = allowBuffer;
      business.bufferBeforeHour = req.body.bufferBeforeHour;
      business.bufferBeforeMin = req.body.bufferBeforeMinute;
      business.bufferAfterHour = req.body.bufferAfterHour;
      business.bufferAfterMin = req.body.bufferAfterMinute;
      business.publish = publish;
      business.incrementHour = req.body.incrementHour;
      business.incrementMin = req.body.incrementMin;
      business.minLead = req.body.minlead;
      business.maxLead = req.body.maxlead;
      business.allowStaffChoice = staff;

      business.save().then(business => {
        res.redirect('/business/list');
      });
    });
  } else {
    res.redirect('/');
  }*/

  Business.findOne({
    _id: req.params.id
  }).then(business => {
    // New values
    business.name = req.body.name;
    business.address = req.body.address;
    business.phone = req.body.phone;
    business.desc = req.body.desc;
    business.website = req.body.website;
    business.startTime = req.body.startTime;
    business.endTime = req.body.endTime;
    business.defaultHour = req.body.defaultHour;
    business.defaultMin = req.body.defaultMin;
    business.minLead = req.body.minlead;
    business.maxLead = req.body.maxlead;

    business.save().then(business => {
      res.json(business);
    });
  });
});

// DELETE BUSINESS
router.delete('/delete/:id', async (req, res, next) => {
  /*const id = req.params.id;
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    Business.deleteOne({
      _id: req.params.id
    }).then(() => res.redirect('/business/list'));
  } else {
    res.redirect('/');
  }*/

  try {
    const business = await Business.findById(req.params.id);
    await business.remove();
    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ success: false });
  }
});

// CREATE /GET
router.get('/create', async (req, res, next) => {
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    let parms = {
      title: 'QUT Booking - Create Business',
      active: {
        business: true
      },
      user: accessIdentity.username
    };

    res.render('businesses/add', parms);
  } else {
    res.redirect('/');
  }
});

// CREATE /POST
router.post('/create', async (req, res, next) => {
  /*const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
  const userName = accessIdentity.username;
  const email = accessIdentity.email;*/

  // Special check for boolean var (checkbox in html)
  /*let allowBuffer;
    if (req.body.bufferSwitch)
        allowBuffer = true;
    else
        allowBuffer = false;

    let publish;
    if (req.body.publish)
        publish = true;
    else
        publish = false;

    let staff;
    if (req.body.staff)
        staff = true;
    else
        staff = false;*/

  const newBusiness = {
    owner: req.body.owner,
    email: req.body.email,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    desc: req.body.desc,
    website: req.body.website,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    defaultHour: req.body.defaultHour,
    defaultMin: req.body.defaultMin,
    minLead: req.body.minlead,
    maxLead: req.body.maxlead
  };

  new Business(newBusiness).save().then(business => {
    //res.redirect('/business/list');
    res.json(business);
  });
});

// PUBLISH
router.get('/publish', async (req, res, next) => {
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    let parms = {
      title: 'Publish Business',
      active: {
        publish: true
      },
      user: accessIdentity.username,
      fullURL: `${req.protocol}://${req.get('host')}/events/create/${
        accessIdentity.email
      }`
    };

    res.render('businesses/publish', parms);
  } else {
    // Redirect to home
    res.redirect('/');
  }
});

module.exports = router;

/*let parms = {
        title: 'Create Business',
        active: {
            createBusiness: true
        }
    };

    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;

    if (accessToken && userName) {
        parms.user = userName;

        // Initialize Graph client
        const client = graph.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });

        const bookingBusiness = {
            displayName:"QUT Booking 2",
            address:{
                postOfficeBox:"P.O. Box 123",
                street:"4567 Main Street",
                city:"Buffalo",
                state:"NY",
                countryOrRegion:"USA",
                postalCode:"98052"
            },
            phone:"206-555-0100",
            email:"manager@fourthcoffee.com",
            webSiteUrl:"https://www.fourthcoffee.com",
            defaultCurrencyIso:"USD"
        };

        try {
            // Get the first 10 events for the coming week
            const result = await client.api('/bookingBusinesses')
                                        .version('beta')
                                        .post(bookingBusiness);

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
    }*/
