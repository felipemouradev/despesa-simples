import {SET_USER} from './../types';

export default function (state = {
    email: null
}, action) {
    switch (action.type) {
        case SET_USER:
            return {...state, email: action.payload};
        default:
            return state;
    }
}
