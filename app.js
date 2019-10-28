const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Load models
require('./models/User');
require('./models/Business');

// LOAD ENV IN .env into process.env. This contains auth stuff
require('dotenv').config();

// ADD ROUTES
const index = require('./routes/index');
const users = require('./routes/users');
const authorize = require('./routes/authorize');
const mail = require('./routes/mail');
const calendar = require('./routes/calendar');
const events = require('./routes/events');
//const test = require('./routes/test');
const businesses = require('./routes/business_old');
const staffs = require('./routes/staff_old');

// Handlebars helpers
const { select } = require('./helpers/hbs');

// Map global Promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose
  .connect(
    'mongodb+srv://lpredrum136:legolas136@qutbooking-oh2dc.mongodb.net/test?retryWrites=true&w=majority',
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

//==START APP
const app = express();

// Body parser middleware
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(express.json());

// Cors middleware
app.use(cors());
app.options('*', cors());

// Handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      select: select
    }, // To import the helpers function for rendering hbs so that you can use these functions in handlebars file
    defaultLayout: 'main' // If you dont set this, defaultLayout will be "layout.handlebars"
  })
);
app.set('view engine', 'handlebars');

// Static folder: Tell app this is the static folder with css, front-end views, images.
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Cookieparser middleware
app.use(cookieParser());

// =========== CONTINUE ROUTES MIDDLEWARE
app.use('/', index);
app.use('/users', users);
app.use('/authorize', authorize);
app.use('/mail', mail);
app.use('/calendar', calendar);
app.use('/events', events);
//app.use('/test', test);
app.use('/business', businesses);
app.use('/staff', staffs);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
