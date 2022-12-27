import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from "./i18n";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { LoginRegisterApi } from './api/ucenter'

router.beforeResolve((to, from, next)=>{
  // 检查是否有登录
  if(to.path !== '/forgot' && to.path !== '/login'){
    LoginRegisterApi().checkToken().then((data: any)=>{
      if (data.code == 2000){
          let user: any = data.obj;
          window.localStorage.setItem("avatar", user.avatar);
          window.localStorage.setItem("userName", user.userName);
          if(from.path !== '/index'){
            next({
              path: '/index'
            })
          }
      }
    })
  }
  next();
})
createApp(App)
.use(store)
.use(router)
.use(i18n)
.use(ElementPlus, {
  locale: zhCn,
})
.mount('#app')
