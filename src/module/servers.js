import * as axios from 'axios';

export default {
  async onload(ctx, next) {
    ctx.clients = {}
    if (ctx.bootOpts.servers) {
      for(const key in ctx.bootOpts.servers) {
        //each server has different config
        ctx.clients[key] = axios.create(Object.assign({
          withCredentials: true
        }, ctx.bootOpts.servers[key]));
      }
    }
    ctx.client = ctx.clients.default || axios.create(Object.assign({
      withCredentials: true
    }))
  }
}
