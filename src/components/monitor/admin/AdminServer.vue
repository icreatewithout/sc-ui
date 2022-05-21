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
      height: document.documentElement.clientHeight - 94.5 + "px;",
      info: JSON.parse(this.$store.state.user.info)
    }
  }, mounted: function () {
    setTimeout(() => {
      const token = this.token
      let iframe = document.querySelector("#iframe");
      this.populateIframe(iframe, [["Authorization", "Bearer " + token]]);
    }, 230);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + "px;";
    };
  },
  methods: {
    populateIframe(iframe, headers) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", admin);
      xhr.responseType = "blob";
      headers.forEach((header) => {
        xhr.setRequestHeader(header[0], header[1]);
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            iframe.src = URL.createObjectURL(xhr.response);
          }
        }
      };
      xhr.send();
    },
  }
}
</script>

<style scoped>

</style>