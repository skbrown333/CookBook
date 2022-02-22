import { COOKBOOK } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class CookbookService extends BaseService {
  route: any;

  constructor() {
    const route = COOKBOOK.route;
    super(route);
    this.route = route;
  }

  async getByGame(gameId, preview?) {
    const params = { game: gameId, preview };
    return await super.get(params);
  }

  async getByName(gameId, name) {
    const params = { game: gameId, name };
    const cookbooks = await super.get(params);
    return cookbooks[0];
  }
}
