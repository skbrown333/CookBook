import axios from './axios.instance';
import qs from 'qs';

export class BaseService {
  route: string;

  constructor(route: string) {
    this.route = route;
  }

  async get(params?) {
    const res = await axios.get(this.route, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
    return res.data;
  }

  async update(id, user, params?, headers?) {
    const token = await user.user.getIdToken();
    headers = { ...headers, ...{ Authorization: `Bearer ${token}` } };
    const res = await axios.patch(this.route + '/' + id, params, { headers });
    return res.data;
  }

  async getById(id) {
    const res = await axios.get(this.route + '/' + id);
    return res.data;
  }

  async delete(id, user, headers?) {
    const token = await user.user.getIdToken();
    headers = { ...headers, ...{ Authorization: `Bearer ${token}` } };
    return await axios.delete(this.route + '/' + id, { headers });
  }

  async create(params, user, headers?) {
    const token = await user.user.getIdToken();
    headers = { ...headers, ...{ Authorization: `Bearer ${token}` } };
    const res = await axios.post(this.route, params, { headers });
    return res.data;
  }
}
