import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'

const app=createApp(App)

//再实例上绑定属性
app.config.globalProperties.$api=api

//路由守卫
const whiteList = ['/login', '/'] // 👈 添加 '/' 到白名单！

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('h5_token')

  if (whiteList.includes(to.path)) {
    next() // 放行白名单
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

//路由
app.use(router)

//
app.mount('#app')
