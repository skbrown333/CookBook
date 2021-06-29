export const UPDATE_USER_ACTION = 'UpdateUserAction';
export const UPDATE_TWITCH = 'UpdateTwitch';
export const UPDATE_TOASTS = 'UpdateToasts';
export const UPDATE_COOKBOOK = 'UpdateCookbook';
export const UPDATE_GAME = 'UpdateGame';
export const UPDATE_ADD = 'UpdateAdd';

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

export function updateGame(game) {
  return {
    type: UPDATE_GAME,
    payload: game,
  };
}

export function updateAddStatus(status) {
  return {
    type: UPDATE_ADD,
    payload: status,
  };
}
