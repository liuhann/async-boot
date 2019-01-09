import contextProto from './utils/context'
import {isFunction} from './utils/lang'
import compose from 'koa-compose'

import bootVue from './module/boot-vue'
import httpClient from './module/servers'

/**
 * Boot class
 * Load modules, extract module routes and data services
 * @class AsyncBoot
 */
/**
 * @param {object} bootOpts boot options
 * @param {array} bootOpts.packages package list
 * @param {object|async function} [bootOpts.rootApp={}] root module
 * @param {string} [bootOpts.mount="app"] the html element to mount to
 * @param {object} [bootOpts.servers] http services locations
 * @param {function|array} [bootOpts.started] callback function or a list of middle-wares with koa-style which would be trigger like onions
 */
class AsyncBoot {
  constructor (bootOpts) {
    // page context
    this.ctx = Object.create(contextProto)
    this.ctx.bootOpts = bootOpts
    this.ctx.config = bootOpts.config || {}
    this.ctx.booter = this
    this.systemModules = {
      vue: bootVue,
      servers: httpClient
    }

    // application modules  (load on startUp)
    this.modules = []
    this.moduleHanlders = []
    this.onStarted = isFunction(bootOpts.started) ? [bootOpts.started] : bootOpts.started
  }

  async startUp () {
    await this.loadSystemModules()
    await this.loadModules(this.ctx.bootOpts.packages)
    await this.started()
  }

  async loadSystemModules () {
    const awaits = []
    for (let key in this.systemModules) {
      awaits.push(this.use(this.systemModules[key], this.ctx.bootOpts[key]))
    }
    await Promise.all(awaits)
  }

  /**
   * Using system modules
   * @param system
   * @param options
   * @returns {Promise<[]>}
   */
  async use (system, options) {
    // onload\moduleLoaded\started callbacks
    if (isFunction(system.load)) {
      await system.load(this.ctx)
    }
    if (isFunction(system.onModuleLoad)) {
      this.moduleHanlders.push(system.onModuleLoad)
    }
    if (isFunction(system.started)) {
      this.onStarted.push(system.started)
    }
  }

  async loadModules (packages) {
    // 依次循环解析每个module
    for (const def of packages) {
      let module = def
      // 以import形式引入的module
      if (isFunction(def)) {
        module = await def()
      }
      for (const moduleHanlder of this.moduleHanlders) {
        moduleHanlder(module, this.ctx)
      }
      if (isFunction(module.onload)) {
        await module.onload(this.ctx, this.ctx.config || {})
      }
      this.modules.push(module)
    }
  }

  /**
   * 处理系统模块的 started 事件， 这个次序遵循koa洋葱圈模型
   */
  async started () {
    const composed = compose(this.onStarted)
    try {
      await composed(this.ctx)
    } catch (err) {
      console.error('boot err:', err)
    }
  }
}

export default AsyncBoot
