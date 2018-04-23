import HttpClient from './utils/http-client';
import contextProto from  './utils/context';
import {isFunction, isPlainObject} from './utils/lang';

/**
 * Boot Strap class
 * Load modules, extract vue routes and data services
 * @class BootStrap
 */
class BootStrap {
	/**
	 * @param {object} bootOpts boot options
	 * @param {array} bootOpts.modules module list
	 * @param {object|async function} [bootOpts.rootApp={}] root vue
	 * @param {string} [bootOpts.mount="app"] the html element to mount to
	 * @param {object} [bootOpts.servers] http services locations
	 * @param {function} [bootOpts.started] trigger on bootstrap complete
	 * @param {function} [bootOpts.bootCompleted] A list of middle-wares with koa-style which would be trigger like onions
	 */
	constructor(bootOpts) {
		this.rootApp = bootOpts.rootApp || {};
		this.modules = bootOpts.modules;
		this.mount = bootOpts.mount || '#app';
		this.servers = bootOpts.servers;
		this.startCallback = isFunction(bootOpts.started)? bootOpts.started : function(vm){ };
		this.bootCompleted = bootOpts.bootCompleted || [];
	}

	/**
	 * Making page ctx
	 * @returns {contextProto}
	 */
	getContext() {
		const ctx = Object.create(contextProto);
		ctx.bootstrap = this;

		//Register ctx.servers.xxx
		if (this.servers) {
			ctx.servers = {};
			for(const key in this.servers) {
				//each server has different config
				ctx.servers[key] = new HttpClient(this.servers[key]);
				if (key === 'default') { //register default to ctx.server
					ctx.server = ctx.servers[key];
				}
			}
		} else {
			//未进行server配置的话，会默认初始化一个不进行url改写的client
			ctx.server = new HttpClient();
		}
		return ctx;
	}

	/**
	 * 统一配置Vue的参数。
	 */
	configVue(Vue) {
		const rootContext = this.getContext();
		Object.defineProperty(Vue.prototype, 'ctx', {
			get () { return rootContext }
		});
		Vue.config.errorHandler = function (err, vm, info) {
			// handle error
			// `info` is a Vue-specific error info, e.g. which lifecycle hook
			// the error was found in. Only available in 2.2.0+
			if (vm.ctx) {
				vm.ctx.onError(err, vm, info);
			}
		}
	}

	/**
	 * Boot vue and load modules (with awaited route)
	 *
	 * 0. 处理Vue相关内容
	 * 1. 加载和解析模块
	 * 2. 创建 router 实例，通过ModuleExtractor解析出路由配置，传入vue-router
	 * 3. 注册数据模型对象到nt
	 * 4. 创建和挂载Vue根实例。
	 * 5. started回调
	 */
	async startUp() {
		const Vue = (await import(/* webpackChunkName: "vue" */'vue')).default;
		const VueRouter = (await import(/* webpackChunkName: "vue" */'vue-router')).default;

		Vue.use(VueRouter);
		await this.configVue(Vue);

		let routes = [];

		if (this.modules) {
			routes = await this.loadModules(this.modules);
		}

		this.router = new VueRouter({
			routes: routes
		});
		this.rootApp = (await this.rootApp()).default
		this.rootApp.router = this.router;

		//4. 启动Vue
		this.app = new Vue(this.rootApp).$mount(this.mount);

		//check loading?
		await this.started();
	}

	async loadModules(modules) {
		// 依次循环解析每个module
		const routes = [];
		for(const def of modules) {
			let module = def;
			if (isFunction(def)) {
				module = (await def()).default;
			}
			if (module.routes) {
				[].push.apply(routes, module.routes);
			}
		}
		return routes;
	}

	/**
	 * 整个app启动完成后的操作。 可以在此处设置， 默认加载的第一页
	 */
	async started() {
		const composed = compose(this.bootCompleted)
		try {
			await composed(this.getContext())
		} catch (err) {
			console.log('boot complete err:' + err)
		}
		await this.startCallback(this.app);
	}
}
export default BootStrap;
