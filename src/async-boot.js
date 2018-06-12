import contextProto from  './utils/context'
import {isFunction, isPlainObject} from './utils/lang'
import compose from 'koa-compose'

import bootVue from './module/boot-vue'
import httpServers from './module/servers'

/**
 * Boot class
 * Load modules, extract module routes and data services
 * @class AsyncBoot
 */
/**
 * @param {object} bootOpts boot options
 * @param {array} bootOpts.systemModules system module list. system module is run before module load
 * @param {array} bootOpts.packages package list
 * @param {object|async function} [bootOpts.rootApp={}] root module
 * @param {string} [bootOpts.mount="app"] the html element to mount to
 * @param {object} [bootOpts.servers] http services locations
 * @param {function} [bootOpts.started] trigger on bootstrap complete
 * @param {function} [bootOpts.bootCompleted] A list of middle-wares with koa-style which would be trigger like onions
 */
class AsyncBoot {
	constructor(bootOpts) {
		// page context
        this.ctx = Object.create(contextProto)
        this.ctx.bootOpts = bootOpts

        this.systemModules = [bootVue, httpServers, ...bootOpts.systemModules]

		// application modules
        this.modules = []

		// system callback on module loaded
        this.onModuleLoads = []

		this.bootCompleted = bootOpts.bootCompleted || []
	}

	async startUp() {
		await this.loadSystemModules()

		await this.loadModules(this.ctx.bootOpts.packages)

		await this.started()
	}

	async loadSystemModules() {
		const onLoads = []
		for (const module of this.systemModules) {
			if (isFunction(module.onload)) {
                onLoads.push(module.onload)
			}
			if (isFunction(module.onModuleLoad)) {
				this.onModuleLoads.push(module.onModuleLoad)
			}
		}
		const composed = compose(onLoads)
		await composed(this.ctx)
	}

    async loadModules(packages) {
        // 依次循环解析每个module
        for(const def of packages) {
            let module = def
			// 以import形式引入的module
            if (isFunction(def)) {
                module = (await def()).default
            }
            this.modules.push(module)
			for (const systemOnModuleLoaded of this.onModuleLoads) {
                systemOnModuleLoaded(module, this.ctx)
			}
        }
    }

	/**
	 * 整个app启动完成后的操作。 可以在此处设置， 默认加载的第一页
	 */
	async started() {
		const composed = compose(this.bootCompleted)
		try {
			await composed(this.ctx)
		} catch (err) {
			console.log('boot complete err:' + err)
		}
	}
}
export default AsyncBoot
