import { createApp } from 'vue'
import './style.css' //清除默认样式
import App from './App.vue'
import router from './router/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'//图标
import store from './store'
import panelHead from './components/panelHead.vue'


//刷新后的动态路由添加
const localData=localStorage.getItem('pz_v3pz')
if(localData){
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item=>{
      router.addRoute('main',item)
  })
}

//路由守卫
router.beforeEach((to,from)=>{
    //非登录页面
    const token=localStorage.getItem('pz_token')
    if(!token&&to.path!=='/login'){
      return '/login'
    }else if(token&&to.path==='/login'){
      return '/'
    }else{
      return true
    }
})

const app=createApp(App)

//全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.component('panelHead',panelHead)

//路由全局注册
app.use(router)
//store挂载
app.use(store)
app.mount('#app')
