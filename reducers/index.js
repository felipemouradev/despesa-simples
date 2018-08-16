import { combineReducers } from 'redux';
import config from './config';
import user from './user';
import cashFlow from './cash-flow';

const rootReducer = combineReducers({
    config,
    user,
    cashFlow
});

export default rootReducer;