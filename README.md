# async-boot

Boot a web-app with async loading of modules and koa style middleware support

## install 

```
    npm i async-boot --save
```

## 使用


### 基本实例

```javascript
import AsyncBoot from 'async-boot'
import AppRoot from './components/root.vue'  
import config from './config/config'

import package1 from './packages/dao/index'
import package2 from './packages/home/index'

const boot = new AsyncBoot({
  vue: {
    rootApp: AppRoot,
    mount: '#app'
  },
  servers: config.servers,
  packages: [
      package1, package2
  ],
  started: [(ctx, next) => {
    ctx.vueRouter.replace('/home')
  }]
})
boot.startUp()
```

### 模块编写

1 routes （Array|async function）属性暴露的路由会注册到全局的vue-router
2 onload （async function） 模块加载会执行 
3 


```javascript
import AppDAO from './app-dao'

export default {
  async onload (ctx, next) {	//系统加载后模块初始化服务
    ctx.appDao = new AppDAO(ctx)
    await next()
  },
  routes: [{	//模块内置的路由
    path: '/home',
    component: Main
  }]
}
```

### 基本元素

### 系统模块和应用模块

async-boot内置2个系统模块，分别负责vue、vue-router的启动及跨域访问的http client初始化

#### ctx  
页面上下文，全局单例， 在启动期间系统模块和应用模块都可以将配置、服务等对象注入其中。 同时在vue文件中也可以通过 this.ctx获取。

### 参数
#### AsyncBoot 参数
- vue 指定vue配置
- servers 指定服务配置
- packages 数组，项目包含的模块
- started 启动回调 koa风格
