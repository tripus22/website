import { createStore, combineReducers } from 'redux'
import theme from  '../reducers/theme';
import auth from  '../reducers/auth';


export const store = createStore(
    combineReducers({
        theme,
        auth,
    })
);