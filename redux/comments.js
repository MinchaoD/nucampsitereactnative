import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, errMess: action.payload};
            
        case ActionTypes.ADD_COMMENT:
            const comment = action.payload;
            comment.id = state.comments.length;  // the reason to add .id here is that in the original comments.js under shared or json server,
            // there are id, campsiteId, author, text and date. All the others have been defined including date, we just need to define id here.
            
            return {...state, comments: state.comments.concat(comment)};
        default:
            return state;
    }
};