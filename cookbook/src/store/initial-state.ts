export interface AppContext {
  user?: any;
  streams?: any;
}

export const InitialState: AppContext = {
  user: null,
  streams: null,
};
