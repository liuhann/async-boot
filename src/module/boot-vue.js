import {isArray, isFunction, isEmpty} from "../utils/lang";
import Vue from 'vue'

export default {

  async load (ctx) {
    const options = {
      router: true,
      vuex: true,
      ...ctx.bootOpts.vue
    }

    if (options.router) {
      const VueRouter = (await import(/* webpackChunkName: "vue" */'vue-router')).default
      Vue.use(VueRouter)
      ctx._router = new VueRouter()
    }
    if (options.vuex) {
      const Vuex = (await import(/* webpackChunkName: "vuex" */'vuex')).default
      Vue.use(Vuex)
      ctx._store = new Vuex.Store()
    }
    //ctx is read only
    Object.defineProperty(Vue.prototype, 'ctx', {
      get() {
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

    if (module.store) { // register store module by module name
      ctx._store.registerModule(module.name, module.store)
    }
  },

  async started (ctx, next) {
    const vueOptions = ctx.bootOpts.vue.rootApp || {}
    vueOptions.router = ctx._router
    vueOptions.store = ctx._store
    ctx.vueRootApp = new Vue(vueOptions)

    await next()

    // mount at last
    ctx.vueRootApp.$mount(ctx.bootOpts.vue.mount || '#app')
  }
}
