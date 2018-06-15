import * as axios from 'axios'

export default {
  async load (ctx) {
    ctx.clients = {}
    if (ctx.bootOpts.servers) {
      for (const key in ctx.bootOpts.servers) {
        // multi-client
        ctx.clients[key] = axios.create({
          withCredentials: true,
          ...ctx.bootOpts.servers[key]
        })
      }
    }
    ctx.client = ctx.clients.default || axios.create(Object.assign({
      withCredentials: true
    }))
  }
}
