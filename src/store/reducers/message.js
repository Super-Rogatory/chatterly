import * as types from '../actions/actionTypes';

export const messagesReducer = (state = [], action) => {
    switch(action.type){
        case types.ADD_MESSAGE:
            return [...state, action.message];
        case types.FETCH_MESSAGES:
            return action.messages;
        default:
            return state;
    }
}