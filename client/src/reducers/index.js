import { combineReducers } from 'redux';
import authReducer from './authReducer';
import businessReducer from './businessReducer';
import eventReducer from './eventReducer';

const rootReducer = combineReducers({
  myauth: authReducer,
  mybusiness: businessReducer,
  myevent: eventReducer
});

export default rootReducer;
