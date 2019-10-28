const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BusinessSchema = new Schema({
  owner: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  defaultHour: {
    type: Number,
    default: 0
  },
  defaultMin: {
    type: Number,
    default: 15
  },
  minLead: {
    type: Number,
    default: 24
  },
  maxLead: {
    type: Number,
    default: 5
  }
});

mongoose.model('businesses', BusinessSchema);
