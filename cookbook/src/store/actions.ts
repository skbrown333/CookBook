export const UPDATE_USER_ACTION = "UpdateUserAction";

export function updateUser(user) {
  return {
    type: UPDATE_USER_ACTION,
    payload: user,
  };
}
