import { USER } from '../../constants/constants';
import { BaseService } from '../BaseService';

export default class UserService extends BaseService {
  route: any;

  constructor() {
    const route = USER.route;
    super(route);
    this.route = route;
  }
}
