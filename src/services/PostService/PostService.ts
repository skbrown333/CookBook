import { COOKBOOK, POST } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class PstService extends BaseService {
  route: any;

  constructor(cookbook) {
    const route = `${COOKBOOK.route}/${cookbook}${POST.route}`;
    super(route);
    this.route = route;
  }
}
