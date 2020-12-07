import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/reducers';
import jobReducer from '../dashboard/reducers';

const reducers = {
  authReducer,
  jobReducer
}

const rootReducer = combineReducers(reducers);

const store = configureStore({
  reducer: rootReducer
})

export default store;
