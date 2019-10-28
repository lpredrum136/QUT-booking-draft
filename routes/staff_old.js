const express = require('express');
const router = express.Router();
//const request = require('request');
const authHelper = require('../helpers/auth');
const graph = require('@microsoft/microsoft-graph-client');
// const type = require('@microsoft/microsoft-graph-types');
require('isomorphic-fetch');
const mongoose = require('mongoose');

// Load Staff Model
require('../models/Staff');
const Staff = mongoose.model('staffs');

// CREATE / GET
router.get('/create', async (req, res, next) => {
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    let parms = {
      title: 'New Staff',
      active: {
        staff: true
      },
      user: accessIdentity.username
    };

    res.render('staffs/add', parms);
  } else {
    res.redirect('/');
  }
});

// CREATE / POST
router.post('/create', async (req, res, next) => {
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    const boss_email = accessIdentity.email;

    const newStaff = {
      boss: boss_email,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    new Staff(newStaff).save().then(staff => res.redirect('/staff/list'));
  } else {
    res.redirect('/');
  }
});

// MANAGE / LIST / GET
router.get('/list', async (req, res, next) => {
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    let parms = {
      title: 'All Staff',
      active: {
        staff: true
      },
      user: accessIdentity.username
    };

    // Get all businesses
    Staff.find({
      boss: accessIdentity.email
    }).then(staffs => {
      parms.staffs = staffs;
      res.render('staffs/index', parms);
    });
  } else {
    res.redirect('/');
  }
});

// EDIT /GET
router.get('/edit/:id', async (req, res, next) => {
  const id = req.params.id;
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    const email = accessIdentity.email;

    let parms = {
      title: 'Edit Staff',
      active: {
        staff: true
      },
      user: accessIdentity.username
    };

    Staff.findOne({
      _id: id
    }).then(staff => {
      if (staff.boss != email) {
        res.redirect('/staff/list');
      } else {
        parms.staff = staff;
        res.render('staffs/edit', parms);
      }
    });
  } else {
    res.redirect('/');
  }
});

// EDIT /PUT
router.put('/edit/:id', async (req, res, next) => {
  const id = req.params.id;
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    Staff.findOne({
      _id: id
    }).then(staff => {
      // New values
      staff.name = req.body.name;
      staff.email = req.body.email;
      staff.phone = req.body.phone;

      staff.save().then(staff => res.redirect('/staff/list'));
    });
  } else res.redirect('/');
});

// DELETE STAFF
router.delete('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

  if (accessIdentity) {
    Staff.deleteOne({
      _id: req.params.id
    }).then(() => res.redirect('/staff/list'));
  } else {
    res.redirect('/');
  }
});

module.exports = router;
