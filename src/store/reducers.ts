import * as Actions from "./actions";

export const Reducer = (state, action) => {
  switch (action.type) {
    case Actions.UPDATE_USER_ACTION:
      return { ...state, user: action.payload };
    case Actions.UPDATE_STREAMS:
      return { ...state, streams: action.payload };
    case Actions.UPDATE_TAGS:
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};
