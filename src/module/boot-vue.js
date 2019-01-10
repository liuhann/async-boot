import {isArray, isFunction} from '../utils/lang'

export default {
  async load (ctx) {
    const options = {
      router: true,
      ...ctx.bootOpts.vue
    }
    const Vue = ctx.bootOpts.Vue || window.Vue
    if (Vue == null) {
      console.error('Vue must be imported as opts.Vue or window.Vue')
      return
    }
    ctx.Vue = Vue
    if (options.router) {
      const VueRouter = ctx.bootOpts.VueRouter || window.VueRouter
      if (VueRouter) {
        Vue.use(VueRouter)
        ctx._router = new VueRouter()
        ctx.VueRouter = VueRouter
      }
    }
    // ctx is read only
    Object.defineProperty(Vue.prototype, 'ctx', {
      get () {
        return ctx
      }
    })
  },

  async onModuleLoad (module, ctx) {
    if (isArray(module.routes)) {
      ctx._router.addRoutes(module.routes)
    } else if (isFunction(module.routes)) {
      ctx._router.addRoutes(await module.routes(ctx))
    }
  },

  async started (ctx, next) {
    const vueOptions = ctx.bootOpts.vue.rootApp || {}
    vueOptions.router = ctx._router
    ctx.vueInstance = new ctx.Vue(vueOptions)

    await next()
    // mount at last
    ctx.vueInstance.$mount(ctx.bootOpts.vue.mount || '#app')
  }
}
