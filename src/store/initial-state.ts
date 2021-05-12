export interface AppContext {
  user?: any;
  streams?: any;
  toasts: Array<any>;
}

export const InitialState: AppContext = {
  user: null,
  streams: null,
  toasts: [],
};
