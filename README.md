# async-boot

Boot a web-app with async loading of modules and koa style middleware support

## install 

```
    npm i async-boot --save
```

## 使用

在前端页面应用中，前端的组件化、模块化都是基于mvvm框架进行的，然而离开展示层，并没有一个更抽象的模块级别的方案。产生问题主要体现为

1. 用import进行直接的组件依赖
2. 没有标准的组件初始化操作
3. 缺乏大规模前端应用中多模块的组织
4. 规约多个业务组件中一致的配置和行为

___实际问题是前端缺乏一个类似后端spring这样的服务容器。

async-boot 基于以上问题，给出一个轻量级的解决办法 



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

### 模块基本编写

```javascript
import AppDAO from './app-dao'

export default {
  onload (ctx, next) {	//系统加载后模块初始化服务
    ctx.appDao = new AppDAO(ctx)
  },
  routes: [{	//模块内置的路由
    path: '/home',
    component: Main
  }]
}
```