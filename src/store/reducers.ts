import * as Actions from './actions';

export const Reducer = (state, action) => {
  switch (action.type) {
    case Actions.UPDATE_USER_ACTION:
      return { ...state, ...{ user: action.payload } };
    case Actions.UPDATE_TWITCH:
      return { ...state, twitch: action.payload };
    case Actions.UPDATE_TOASTS:
      return { ...state, ...{ toasts: action.payload } };
    case Actions.UPDATE_COOKBOOK:
      return { ...state, ...{ cookbook: action.payload } };
    case Actions.UPDATE_ADD:
      return { ...state, ...{ add: action.payload } };
    default:
      return state;
  }
};
