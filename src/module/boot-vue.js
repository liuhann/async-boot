import {isArray, isFunction, isEmpty} from "../utils/lang";
import Vue from 'vue/dist/vue.esm'

export default {

	async load (ctx) {
		const options = {
			router: true,
			vuex: true,
			...ctx.bootOpts.vue
		}

		if (options.router) {
			let VueRouter = await import(/* webpackChunkName: "vue-router" */'vue-router')
			VueRouter = VueRouter.default || VueRouter
			Vue.use(VueRouter)
			ctx._router = new VueRouter()
		}
		if (options.vuex) {
			let Vuex = await import(/* webpackChunkName: "vuex" */'vuex')
			Vuex = Vuex.default || Vuex
			Vue.use(Vuex)
			ctx._store = new Vuex.Store(options.store || {})
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
		console.log (module)
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
