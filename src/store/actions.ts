export const UPDATE_USER_ACTION = 'UpdateUserAction';
export const UPDATE_TWITCH = 'UpdateTwitch';
export const UPDATE_TOASTS = 'UpdateToasts';
export const UPDATE_COOKBOOK = 'UpdateCookbook';

export function updateUser(user) {
  return {
    type: UPDATE_USER_ACTION,
    payload: user,
  };
}

export function updateTwitch(twitch) {
  return {
    type: UPDATE_TWITCH,
    payload: twitch,
  };
}

export function updateToasts(toasts) {
  return {
    type: UPDATE_TOASTS,
    payload: toasts,
  };
}

export function updateCookbook(cookbook) {
  return {
    type: UPDATE_COOKBOOK,
    payload: cookbook,
  };
}
