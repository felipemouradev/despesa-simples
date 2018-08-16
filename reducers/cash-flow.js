import {SET_CASH_FLOW, COPY_MONTH_CASH_FLOW} from './../types';
import moment from 'moment';
import _ from 'lodash';
import shortid from 'shortid';

let initialState = {years: {}, currentYear: moment().startOf('year').format("GGGG")};
//last 3 year prev, current, next
const years = [-1, 0, 1];
_.times(3, (y)=> {
    let currentYear = parseInt(initialState.currentYear) + (parseInt(years[y]));
    initialState.years[currentYear] = {};
    _.times(12, (m)=> {
        initialState.years[currentYear][moment().startOf('year').add(m,'month').format('MM')] = [];
    });
});



export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CASH_FLOW:
            state.years[action.payload.year][action.payload.month].push(action.payload.operation);
            return {...state};
        case COPY_MONTH_CASH_FLOW:
            let operationForCopy = state.years[state.currentYear][action.payload.from];
            if(operationForCopy && action.payload.to.length > 0) {
                _.times( action.payload.to.length, (n)=> {
                    _.times(operationForCopy.length, (oFC)=> {
                        operationForCopy[oFC].id = shortid();
                        state.years[state.currentYear][action.payload.to[n].to].push(operationForCopy[oFC]);
                    });
                });
            }
            return {...state};
        default:
            return state;
    }
}
