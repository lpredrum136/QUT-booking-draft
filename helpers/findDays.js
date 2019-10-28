//const moment = require('moment');
const moment = require('moment-business-days');

// five day's work in AU
moment.updateLocale('en', { workingWeekdays: [1, 2, 3, 4, 5] });

const findDays = (minLead, maxLead, interval, endTime) => {
  let days = [];

  const start = moment();
  console.log(start);

  let earliest = start.clone().add(minLead, 'hours');
  console.log(earliest);

  let mmt = moment(`${moment().format('YYYY-MM-DD')}T${endTime}`);

  // Your moment at midnight
  let mmtMidnight = mmt.clone().startOf('day');

  // Difference in minutes
  let endTime_in_mins = mmt.diff(mmtMidnight, 'minutes');

  // If already passed the last slot, still before 00:00 of new day
  if (earliest.hours() * 60 + earliest.minutes() > endTime_in_mins - interval) {
    earliest = earliest.nextBusinessDay(); // Earliest become the next business day
    //console.log(earliest.format('LL'));
    for (let i = 0; i < maxLead; i++) {
      let day = earliest.clone().businessAdd(i, 'days');
      days.push(day);
    }
    return days;
  } else if (earliest.isSame(start, 'day')) {
    // If not passed the last slot yet, but still in same day, generate today, because you still have at least 1 slot
    for (let i = 0; i < maxLead; i++) {
      let day = earliest.clone().businessAdd(i, 'days');
      days.push(day);
    }
    return days;
  } else if (earliest.isBusinessDay()) {
    // Not passed the last slot yet, but earliest is tomorrow, so if tomorrow is a business day, generate from tomorrow
    for (let i = 0; i < maxLead; i++) {
      let day = earliest.clone().businessAdd(i, 'days');
      days.push(day);
    }
    return days;
  } else {
    // Not passed the last slot yet, but earliest is tomorrow, but if tomorrow is not a business day, start generate from next business day
    earliest = earliest.nextBusinessDay();
    for (let i = 0; i < maxLead; i++) {
      let day = earliest.clone().businessAdd(i, 'days');
      days.push(day);
    }
    return days;
  }
};

module.exports = findDays;
