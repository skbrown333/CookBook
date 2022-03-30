import { GAME, URL_UTILS } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class CharacterService extends BaseService {
  route: any;

  constructor() {
    const route = GAME.route;
    super(route);
    this.route = route;
  }

  async getBySubdomain() {
    const params = { subdomain: URL_UTILS.subdomain };
    return await super.get(params);
  }
}
