import axios from './axios.instance';

export class BaseService {
  route: string;

  constructor(route: string) {
    this.route = route;
  }

  async get(params?) {
    const res = await axios.get(this.route, { params });
    return res.data;
  }

  async update(id, params?) {
    const res = await axios.patch(this.route + '/' + id, { params });
    return res.data;
  }

  async getById(id) {
    const res = await axios.get(this.route + '/' + id);
    return res.data;
  }

  async delete(id) {
    return await axios.delete(this.route + '/' + id);
  }

  async create(params, headers?) {
    const res = await axios.post(this.route, params, { headers });
    return res.data.model;
  }
}
