<template>
  <el-config-provider :locale="locale">
    <router-view :to="{path:'/'}"/>
  </el-config-provider>
</template>
<script>
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'App',
  components: {ElConfigProvider},
  data() {
    return {
      locale: zhCn
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
