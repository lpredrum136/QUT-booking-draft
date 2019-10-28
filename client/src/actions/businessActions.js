import {
  ADD_BUSINESS,
  GET_BUSINESSES,
  DELETE_BUSINESS,
  GET_ONE_BUSINESS,
  EDIT_BUSINESS
} from './types';
import axios from 'axios';
//import { loadUser } from './authActions';

export const addBusiness = business_data => {
  const dispatchAddBusiness = async dispatch => {
    console.log(business_data);
    try {
      //dispatch(loadUser());

      const new_business = await axios.post(
        'http://localhost:3000/business/create',
        business_data
      );

      dispatch({
        type: ADD_BUSINESS,
        payload: new_business.data
      });
    } catch (error) {
      console.log(error.response);
    }
  };
  return dispatchAddBusiness;
};

export const getBusinesses = email => {
  const dispatchGetBusinesses = async dispatch => {
    try {
      console.log(email);

      //dispatch(loadUser());

      const businesses = await axios.post(
        'http://localhost:3000/business/list',
        { email: email }
      );

      dispatch({
        type: GET_BUSINESSES,
        payload: businesses.data
      });
    } catch (error) {
      console.log(error);
    }
  };
  return dispatchGetBusinesses;
};

export const getOneBusiness = id => {
  const dispatchGetOneBusiness = async dispatch => {
    try {
      const one_business = await axios.get(
        `http://localhost:3000/business/edit/${id}`
      );
      dispatch({
        type: GET_ONE_BUSINESS,
        payload: one_business.data
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return dispatchGetOneBusiness;
};

export const editBusiness = (business_data, id) => {
  const dispatchEditBusiness = async dispatch => {
    console.log(business_data);
    try {
      //dispatch(loadUser());

      const new_business = await axios.put(
        `http://localhost:3000/business/edit/${id}`,
        business_data
      );

      dispatch({
        type: EDIT_BUSINESS,
        payload: new_business.data
      });
    } catch (error) {
      console.log(error.response);
    }
  };
  return dispatchEditBusiness;
};

export const deleteBusiness = id => {
  const dispatchDeleteBusiness = async dispatch => {
    try {
      await axios.delete(`http://localhost:3000/business/delete/${id}`);

      dispatch({
        type: DELETE_BUSINESS,
        payload: id
      });
    } catch (error) {
      console.log(error);
    }
  };
  return dispatchDeleteBusiness;
};
