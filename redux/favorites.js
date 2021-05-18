import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action ) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            if (state.includes(action.payload)) {  // the state here is the campsiteId, so if there campsiteId is already included,
                // then just return the current state, otherwise, add new campsiteId to the state using concat
                // the payload is campsiteId, because it is set up in the ActionCreator file line 153
                return state;
            }
            return state.concat(action.payload);
        default:
            return state;
    }

}