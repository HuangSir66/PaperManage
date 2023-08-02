import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from "@/views/Main.vue";
import Login from "@/views/Login.vue";
Vue.use(VueRouter)

// 将路由与组件进行映射
const routes = [
    {
        path:'/',
        component: Main,
        name:'Main',
        redirect:'/home',
        children:[
            // { path: '/home', name:'home', component: Home },
            // { path: '/student', name:'student',component: Student },
            // { path: '/teacher',name:'teacher', component: Teacher },
            // { path: '/topiclist',name:'topiclist', component: TopicList },
        ]
    },
    {
        path:'/login',
        name:'login',
        component: Login
    }
]
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})


export default router