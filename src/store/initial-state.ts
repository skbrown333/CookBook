export interface AppContext {
  user?: any;
  streams?: any;
  tags?: any;
}

export const InitialState: AppContext = {
  user: null,
  streams: null,
  tags: null,
};
