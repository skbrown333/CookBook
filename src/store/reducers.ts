import * as Actions from "./actions";

export const Reducer = (state, action) => {
  switch (action.type) {
    case Actions.UPDATE_USER_ACTION:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
