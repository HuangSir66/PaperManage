import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import router from "@/router";
import store from './store'
import './api/mock'
import Cookie from "js-cookie";

Vue.config.productionTip = false
Vue.use(ElementUI)
//添加全局前置导航守卫
router.beforeEach((to,from,next) =>{
  //判断token是否存在
  const token = Cookie.get('token')
  //token不存在,说明当前用户是未登录，跳转至登录
  if(!token && to.name !== 'login'){
    next({name:'login'})
  }else if(token && to.name === 'login'){
    //token存在说明已经登录，跳转至首页
    next({name:'home'})
  }else{
    next()
  }
})

new Vue({
  render: h => h(App),
  router,
  store,
  created() {
    store.commit('addMenu',router)
  }
}).$mount('#app')
