import { GAME } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class CharacterService extends BaseService {
  route: any;

  constructor() {
    const route = GAME.route;
    super(route);
    this.route = route;
  }
}
