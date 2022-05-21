<template>
  <div class="common-layout">
    <el-container>
      <el-header><Header/></el-header>
      <el-main><router-view/></el-main>
      <el-footer><Footer/></el-footer>
    </el-container>
  </div>
</template>

<script>

import Header from "@components/index/Header.vue";
import Footer from "@components/index/Footer.vue";

export default {
  name: "Index",
  components: {Header, Footer},
  data() {
    return {}
  },
  computed: {},
  created() {

  },
  methods: {},

}

</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.el-header {
  padding: 0 0 0 10px;
}

.el-aside {
  width: auto;
}

.el-main {
  padding: 10px;
}
</style>
