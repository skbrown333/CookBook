import { COOKBOOK } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class CookbookService extends BaseService {
  route: any;

  constructor() {
    const route = COOKBOOK.route;
    super(route);
    this.route = route;
  }
}
