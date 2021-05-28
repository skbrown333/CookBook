import { Cookbook } from '../models/Cookbook';
export interface AppContext {
  user?: any;
  twitch?: any;
  toasts: Array<any>;
  cookbook?: Cookbook;
  add: boolean;
}

export const InitialState: AppContext = {
  twitch: null,
  toasts: [],
  add: false,
};
