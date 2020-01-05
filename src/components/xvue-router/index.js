import Link from './link';
import View from './view';
let Vue;

//实现一个插件，挂载$router
export default class KVueRouter {
    constructor (options){
        this.$options = options;

        //创建一个路由映射表
        // options.routes.forEach(route=>{
        //   this.routeMap[route.path] = route;
        // })
        // Vue.util.defineReactive(this,'current','/')
        this.current = window.location.hash.slice(1) || '/';
        Vue.util.defineReactive(this,'matched',[])
        //match方法可以递归遍历路由表，获得匹配关系数组
        this.match()
        //监控地址变化
        window.addEventListener('hashchange',this.onHasnChange.bind(this))
        window.addEventListener('load',this.onHasnChange.bind(this))
    }
    onHasnChange(){
      this.current = window.location.hash.slice(1);
      this.matched = [];
      this.match();
    }

    match(routes){
      routes = routes || this.$options.routes

      //递归遍历
      for(const route of routes){
        if(route.path === '/'&& this.current === '/'){
          this.matched.push(route)
          return
        }
        //假设当前地址是 /about/info
        if(route.path !== '/' && this.current.indexOf(route.path) != -1){
          this.matched.push(route)
          if(route.children){
            this.match(route.children)
          }
          return
        }
      }
    }
}

KVueRouter.install = function (_Vue) {
  // 保存构造函数，在KvueRouter里面使用
  Vue = _Vue;
  
  //挂载router，混淆，可以在其他地方取到
  Vue.mixin({
    beforeCreate () {
      //确保根实例的时候才执行
      if(this.$options.router){
        Vue.prototype.$router = this.$options.router;
      }
    }
  })

  Vue.component('router-link',Link)
  
  Vue.component('router-view',View)
}

