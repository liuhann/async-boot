export default async function bootVue (ctx, next) {
    const Vue = (await import(/* webpackChunkName: "vue" */'vue')).default
    const VueRouter = (await import(/* webpackChunkName: "vue" */'vue-router')).default

    Vue.use(VueRouter)
    let routes = []

    if (this.modules) {
        routes = await this.loadModules(this.modules)
    }

    this.router = new VueRouter({
        routes: routes
    })
    this.rootApp = (await this.rootApp()).default
    this.rootApp.router = this.router

    //4. 启动Vue
    this.app = new Vue(this.rootApp).$mount(this.mount)
}
