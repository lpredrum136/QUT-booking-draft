import {
  CLIENT_GET_BUSINESSES,
  CLIENT_GET_FREE_SLOTS,
  CLIENT_SEND_BOOKING
} from './types';
import axios from 'axios';

export const clientGetBusinesses = email => {
  const dispatchClientGetBusinesses = async dispatch => {
    try {
      const businesses = await axios.get(
        `http://localhost:3000/events/create/${email}`
      );

      dispatch({
        type: CLIENT_GET_BUSINESSES,
        payload: businesses.data
      });
    } catch (error) {
      console.log(error.response);
    }
  };
  return dispatchClientGetBusinesses;
};

export const getFreeSlots = services_data => {
  const dispatchGetFreeSlots = async dispatch => {
    try {
      const response = await axios.post(
        'http://localhost:3000/events/getdays',
        services_data
      );

      dispatch({
        type: CLIENT_GET_FREE_SLOTS,
        payload: response.data.days
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  return dispatchGetFreeSlots;
};

export const sendBooking = booking_data => {
  const dispatchSendBooking = async dispatch => {
    try {
      const confirmed_booking = await axios.post(
        'http://localhost:3000/events/create',
        booking_data
      );

      dispatch({
        type: CLIENT_SEND_BOOKING
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  return dispatchSendBooking;
};
