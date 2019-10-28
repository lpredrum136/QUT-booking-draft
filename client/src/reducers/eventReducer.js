import {
  CLIENT_GET_BUSINESSES,
  CLIENT_GET_FREE_SLOTS,
  CLIENT_SEND_BOOKING
} from '../actions/types';

const initialState = {
  businesses: [],
  doneGetFreeSlots: false,
  freeDays: [],
  bookingSuccessful: false
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_GET_BUSINESSES:
      return {
        ...state,
        businesses: action.payload.businesses
      };

    case CLIENT_GET_FREE_SLOTS:
      return {
        ...state,
        doneGetFreeSlots: true,
        freeDays: action.payload
      };

    case CLIENT_SEND_BOOKING:
      return {
        ...state,
        bookingSuccessful: true
      };

    default:
      return state;
  }
};

export default eventReducer;
