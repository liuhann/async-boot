import * as axios from 'axios';

export default {
  async onload(ctx, next) {
    if (ctx.bootOpts.servers) {
      ctx.clients = {}
      for(const key in ctx.bootOpts.servers) {
        //each server has different config
        ctx.clients[key] = axios.create(Object.assign({
          withCredentials: true
        }, ctx.bootOpts.servers[key]));

        if (key === 'default') { //register default to ctx.server
          ctx.client = ctx.servers[key]
        }
      }
    } else {
      //未进行server配置的话，会默认初始化一个不进行url改写的client
      ctx.client = axios.create(Object.assign({
        withCredentials: true
      });
    }
  }
}
