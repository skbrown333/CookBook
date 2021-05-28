import { COOKBOOK, TAG } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class TagService extends BaseService {
  route: any;

  constructor(cookbook) {
    const route = `${COOKBOOK.route}/${cookbook}${TAG.route}`;
    super(route);
    this.route = route;
  }
}
