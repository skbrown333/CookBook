import { Character } from './Character';

export interface Cookbook {
  _id: string;
  roles: any;
  streamers: Array<string>;
  name: 'string';
  character: Character;
}
