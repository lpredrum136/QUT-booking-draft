import { AUTH_USER, SIGN_OUT } from './types';
import axios from 'axios';
//axios.defaults.withCredentials = true;

// Check user and load user
export const loadUser = () => {
  const dispatchLoadUser = async dispatch => {
    /*var config = {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true
      }
    };*/

    try {
      //console.log(document.cookie);
      const response = await axios.get('http://localhost:3000/', {
        withCredentials: true
      }); // Add config o cuoi neu uncomment dong ben tren
      //console.log(response.data);
      dispatch({
        type: AUTH_USER,
        payload: response.data
      });
    } catch (error) {
      console.log(error);
    }
  };

  return dispatchLoadUser;
};

// Sign user out
export const signOut = () => {
  console.log('sign out action received');
  const dispatchSignOut = dispatch => {
    axios.get('http://localhost:3000/authorize/signout');
    dispatch({
      type: SIGN_OUT
    });
  };

  return dispatchSignOut;
};
