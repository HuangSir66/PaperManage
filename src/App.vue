<template>
  <div id="app">
    <router-view></router-view>
<!--    <test-api/>-->
  </div>
</template>

<script>

// import TestApi from "@/components/TestApi.vue";

export default {
  name: 'App',
  // components:{
  //   // eslint-disable-next-line vue/no-unused-components
  //   TestApi
  // }
}
</script>

<style lang="less">
html,body,h3,p{
  margin: 0;
  padding: 0;
}
</style>