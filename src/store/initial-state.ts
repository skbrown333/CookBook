import { Cookbook } from '../models/Cookbook';
import { Game } from '../models/Game';
import { Guide } from '../models/Guide';

export interface AppContext {
  user?: any;
  twitch?: any;
  toasts: Array<any>;
  cookbook?: Cookbook;
  game?: Game;
  add: boolean;
  guides?: Array<Guide>;
}

export const InitialState: AppContext = {
  twitch: null,
  toasts: [],
  add: false,
  guides: [],
};
