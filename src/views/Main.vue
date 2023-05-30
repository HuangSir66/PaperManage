<template>
  <el-container>
    <el-aside width="auto"><common-aside/></el-aside>
    <el-container>
      <el-header ><common-header/></el-header>
      <common-tag/>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import commonTag from "@/views/commonTag.vue";



export default {
  name: "Main",
  components:{
    // eslint-disable-next-line vue/no-unused-components
    CommonAside,
    // eslint-disable-next-line vue/no-unused-components
    CommonHeader,
    // eslint-disable-next-line vue/no-unused-components
    commonTag,
  }
}
</script>

<style scoped>
.el-header{
  padding: 0;
}
</style>