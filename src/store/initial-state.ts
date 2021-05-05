import { initial_tags } from "../constants/constants";

export interface AppContext {
  user?: any;
  streams?: any;
  tags?: any;
}

export const InitialState: AppContext = {
  user: null,
  streams: null,
  tags: initial_tags,
};
