export const UPDATE_USER_ACTION = "UpdateUserAction";
export const UPDATE_STREAMS = "UpdateStreams";

export function updateUser(user) {
  return {
    type: UPDATE_USER_ACTION,
    payload: user,
  };
}

export function updateStreams(streams) {
  return {
    type: UPDATE_STREAMS,
    payload: streams,
  };
}
