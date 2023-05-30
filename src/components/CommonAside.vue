<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse="isCollapse">
      <h3>{{isCollapse ? '后台':'毕业论文选题系统'}}</h3>
    <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu v-for="item in hasChildren" :key='item.label' :index="item.label">
      <template slot="title">
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
        <el-menu-item @click="clickMenu(subItem)" :index="subItem.path">{{subItem.label}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import Cookie from "js-cookie";

export default {
  name: "CommonAside",
  data(){
    return{
      // isCollapse:false,
      // menuData:[
      //   {
      //     path: '/',
      //     name: 'home',
      //     label: '首页',
      //     icon: 's-home',
      //     url: 'Home/Home'
      //   },
      //   {
      //     path: '/student',
      //     name: 'student',
      //     label: '学生信息管理',
      //     icon: 's-custom',
      //     url: 'MallManage/MallManage'
      //   },
      //   {
      //     path: '/teacher',
      //     name: 'teacher',
      //     label: '教师信息管理',
      //     icon: 'user',
      //     // url: 'UserManage/UserManage'
      //   },
      //   {
      //     label: '论文管理',
      //     icon: 'reading',
      //     children: [
      //       {
      //         path: '/topiclist',
      //         name: 'topiclist',
      //         label: '论文列表',
      //         icon: 'notebook-1',
      //         // url: 'Other/PageOne'
      //       },
      //       {
      //         path: '/page2',
      //         name: 'page2',
      //         label: '页面2',
      //         icon: 'setting',
      //         // url: 'Other/PageTwo'
      //       }
      //     ]
      //   }
      // ]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item){
      //当页面路由与我们跳转到路由一致时才允许跳转
      if(this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))){
        this.$router.push(item.path)
      }
      this.$store.commit('selectMenu',item)
    }
  },
  computed:{
    //没有子菜单的时候
    // eslint-disable-next-line vue/return-in-computed-property
    noChildren(){
      return this.menuData.filter(item => !item.children)
    },
    //有子菜单的时候
    hasChildren(){
      return this.menuData.filter(item => item.children)
    },
    //判断当前数据，如果缓存中没有，当前store中获取
    menuData(){
      return JSON.parse(Cookie.get('menu')) || this.$store.state.tab.menu
    },
    isCollapse(){
      return this.$store.state.tab.isCollapse
    },
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu{
  height: 100vh;
  h3{
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
    border-right: none;
  }
}
</style>
<style lang="less" scoped>
.el-menu{
  border-right: none;
}
</style>