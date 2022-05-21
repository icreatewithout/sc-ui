<template>
  <div :style="'height:'+ height">
    <iframe id="iframe" src="" frameborder="no" style="width: 100%;height: 100%" scrolling="auto"/>
  </div>
</template>
<script>
export default {
  name: "Zipkin",
  computed: {
    getToken() {
      return this.$store.state.user.token
    }
  },
  data() {
    return {
      url: '',
      height: document.documentElement.clientHeight - 94.5 + "px;",
    }
  },
  mounted: function () {
    setTimeout(() => {
      let iframe = document.querySelector("#iframe");
      this.populateIframe(iframe, [["Authorization", "Bearer " + this.getToken()]]);
    }, 230);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + "px;";
    };
  },
  methods: {
    populateIframe(iframe, headers) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", 'http：localhost:8080/xxx');
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