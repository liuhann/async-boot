import {isArray, isFunction} from "../utils/lang";
import Vue from 'vue'
import VueRouter from 'vue-router'

export default {
    async onload(ctx, next) {
        if (ctx.bootOpts.vue) {
            const Vue = (await import(/* webpackChunkName: "vue" */'vue')).default
            const VueRouter = (await import(/* webpackChunkName: "vue" */'vue-router')).default
            Vue.use(VueRouter)
            const router = new VueRouter()
            ctx.vueRouter = router
        }
        await next()
    },

    async moduleLoaded(module, ctx) {
        if (isArray(module.routes)) {
            ctx.vueRouter.addRoutes(module.routes)
        } else if (isFunction(module.routes)) {
            ctx.vueRouter.addRoutes(await module.routes(ctx))
        }
    },

    async started(ctx, next) {
        const vueOptions = ctx.bootOpts.vue.rootApp
        vueOptions.router = ctx.vueRouter
        ctx.vueRootApp = new Vue(vueOptions)
        ctx.vueRootApp.$mount(ctx.bootOpts.vue.mount || '#app')
    }
}
