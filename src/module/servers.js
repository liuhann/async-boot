/* global import */
export default {
  async load (ctx) {
    ctx.clients = {}
    const axios = await import('axios')
    if (ctx.bootOpts.servers) {
      ctx.servers = ctx.bootOpts.servers
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
