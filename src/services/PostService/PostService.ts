import { COOKBOOK, POST } from '../../constants/constants';
import axios from '../axios.instance';
import { BaseService } from '../BaseService';

export default class PstService extends BaseService {
  route: any;

  constructor(cookbook) {
    const route = `${COOKBOOK.route}/${cookbook}${POST.route}`;
    super(route);
    this.route = route;
  }

  async like(id, userId) {
    const res = await axios.patch(this.route + '/' + id + '/like', {
      userId,
    });
    return res.data;
  }
}
