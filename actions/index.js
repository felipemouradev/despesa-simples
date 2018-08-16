import {SET_USER, SET_CASH_FLOW, COPY_MONTH_CASH_FLOW} from './../types';

export function setUser(user) {
    return {
        type: SET_USER,
        payload: user
    }
}

export function setCashFlow(operation, year, month) {
    return {
        type: SET_CASH_FLOW,
        payload: {operation, year, month}
    }
}

export function copyMonthCashFlow(to, from) {
    return {
        type: COPY_MONTH_CASH_FLOW,
        payload: {to, from}
    }
}