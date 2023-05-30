import Vue from "vue";
import Vuex from 'vuex'
import tab from "@/store/tab";
import VueRouter from "vue-router";
Vue.use(Vuex)

//创建Vuex的实例
export default new Vuex.Store({
    modules:{
        tab
    }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
