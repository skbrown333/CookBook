import { Cookbook } from '../models/Cookbook';
import { Game } from '../models/Game';

export interface AppContext {
  user?: any;
  twitch?: any;
  toasts: Array<any>;
  cookbook?: Cookbook;
  game?: Game;
  add: boolean;
}

export const InitialState: AppContext = {
  twitch: null,
  toasts: [],
  add: false,
};
