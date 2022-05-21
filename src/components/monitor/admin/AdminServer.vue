<template>
  <div :style="'height:'+ height">
    <iframe id="iframe" src="" frameborder="no" style="width: 100%;height: 100%" scrolling="auto"/>
  </div>
</template>

<script>
import {admin} from '../../../request/api'

export default {
  name: "AdminServer",
  computed: {
    getToken() {
      return this.$store.state.user.token
    }
  },
  data() {
    return {
      token: this.$store.state.user.token,
      height: document.documentElement.clientHeight - 200 + "px;",
      info: JSON.parse(this.$store.state.user.info)
    }
  },
  mounted: function () {
    setTimeout(() => {
      let iframe = document.querySelector("#iframe")
      iframe.src = admin;
    }, 1000);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 200 + "px;";
    };
  },
  methods: {}
}
</script>

<style scoped>

</style>