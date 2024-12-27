import { createStore, combineReducers } from 'redux';
import userReducer from './userSlice';
import vehicleReducer from './vehicleSlice';
import assuredReducer from './assuredSlice';
import coverReducer from './coverSlice';
import statusReducer from './statusSlice';

const rootReducer = combineReducers({
  user: userReducer,
  vehicle: vehicleReducer,
  assured: assuredReducer,
  cover: coverReducer,
  status: statusReducer,
});

const store = createStore(rootReducer);

export default store;