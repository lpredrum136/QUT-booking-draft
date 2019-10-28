import {
  ADD_BUSINESS,
  GET_BUSINESSES,
  GET_ONE_BUSINESS,
  DELETE_BUSINESS,
  EDIT_BUSINESS
} from '../actions/types';

const initialState = {
  success_add_business: false,
  success_edit_business: false,
  businesses: []
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BUSINESS:
      return {
        ...state,
        success_add_business: true
      };

    case GET_BUSINESSES:
      return {
        ...state,
        businesses: action.payload
      };

    case GET_ONE_BUSINESS:
      console.log('get one biz reducer received');
      return {
        ...state,
        businesses: [...state.businesses, action.payload]
      };

    case EDIT_BUSINESS:
      return {
        ...state,
        success_edit_business: true
      };

    case DELETE_BUSINESS:
      return {
        ...state,
        businesses: state.businesses.filter(
          business => business._id !== action.payload
        )
      };

    default:
      return state;
  }
};

export default businessReducer;
