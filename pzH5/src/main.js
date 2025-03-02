import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'

const app=createApp(App)

//再实例上绑定属性
app.config.globalProperties.$api=api

//路由守卫
router,beforeEach((to,from)=>{
    if(to !=='/login'){
        if(!localStorage.getItem('h5_token')){
            return '/login'
        }
    }
})

//路由
app.use(router)

//
app.mount('#app')
