import Vue from 'vue'
import XRouter from '@/components/xvue-router'


// 1.应用插件
Vue.use(XRouter)

// 2.创建实例
export default new XRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () =>import('../views/Home')
    },
    {
      path: '/about',
      name: 'about',
      component: () =>import('../views/About'),
      children:[
        {
          path: '/about/info',
          component: {
            render(h){ return h('p','this is info')} 
          }
        },
        {
          path: '/about/setting',
          component: {
            render(h){ return h('p','this is setting')} 
          }
        }
      ]
    }
  ]
})
