/*const express = require('express');
const router = express.Router();*/
const moment = require('moment');

/*router.get('/', (req, res, next) => {
    res.send(new Date().toString());
});

module.exports = router;*/
/*const str = '00022000';
const start = moment("2019-10-08T09:30:00");
console.log(start);

let result = [];
result.push(start.format());
for (let i = 1; i < str.length; i++) {
    if (str[i] == 0) {
        let newval = start.clone().add(i, 'hours');
        result.push(newval.format());
    }
}

console.log(result);
console.log(moment().format());

let startabc = moment('2019-10-08T08:00:00');
let end = moment('2019-10-08T17:00:00');
let resultabc = [];

console.log(startabc.diff(end, 'minute'));*/

var promise1 = new Promise(function(resolve, reject) {
  resolve(1);
});

var testy = promise1.then(function(value) {
  console.log(value + 1);
  // expected output: "Success!"
  return value + 2;
});

console.log(testy);

setTimeout(() => {
  console.log(testy);
}, 2000);

const client = graph.Client.init({
  authProvider: done => {
    done(null, accessToken);
  }
});

const bookingBusiness = {
  displayName: 'QUT Lunch Delivery',
  address: {
    postOfficeBox: 'P.O. Box 123',
    street: '4567 George Street',
    city: 'Brisbane',
    state: 'QLD',
    countryOrRegion: 'AUS',
    postalCode: '4000'
  },
  phone: '07-3333-3333',
  email: 'manager@qutlunch.com.au',
  webSiteUrl: 'https://www.qutlunch.com.au',
  defaultCurrencyIso: 'AUD'
};

let res = await client
  .api('/bookingBusinesses')
  .version('beta')
  .post(bookingBusiness);

const client = graph.Client.init({
  authProvider: done => {
    done(null, accessToken);
  }
});

const bookingStaffMember = {
  colorIndex: 1,
  displayName: 'Dana Swope',
  emailAddress: 'danas@qutlunch.com.au',
  role: 'receptionist',
  useBusinessHours: true
};

let res = await client
  .api('/bookingBusinesses/{id}/staffMembers')
  .version('beta')
  .post(bookingStaffMember);

const client = graph.Client.init({
  authProvider: done => {
    done(null, accessToken);
  }
});

const bookingAppointment = {
  customerEmailAddress: 'jordanm@contoso.com',
  customerLocation: {
    address: {
      city: 'Buffalo',
      countryOrRegion: 'USA',
      postalCode: '98052',
      postOfficeBox: null,
      state: 'NY',
      street: '123 First Avenue',
      type: null
    },
    coordinates: null,
    displayName: 'Customer',
    locationEmailAddress: null,
    locationType: null,
    locationUri: null,
    uniqueId: null,
    uniqueIdType: null
  }
};

let res = await client
  .api('/bookingBusinesses/QUTLunch@M365B489948.onmicrosoft.com/appointments')
  .version('beta')
  .post(bookingAppointment);

const mongoose = require('mongoose');

// Map global Promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose
  .connect(
    'mongodb+srv://lpredrum136:********@qutbooking-oh2dc.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.log(err));
