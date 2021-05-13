import { Cookbook } from "../models/Cookbook";
export interface AppContext {
  user?: any;
  streams?: any;
  toasts: Array<any>;
  cookbook?: Cookbook;
}

export const InitialState: AppContext = {
  user: null,
  streams: null,
  toasts: [],
};
