<template>
  <div class="tag">
    <el-tag v-for="tag in tags" :key="tag.name"
            class="mx-1"
            size="large"
            @click="clickTag(tag.id)"
            @close="closeTag(tag.id)"
            :type="tag.type"
            @checked="tag.checked"
            @change="onChange"
            :closable="tag.closable"
    >
      {{ tag.name }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "Tags",
  computed: {
    getTags() {
      return this.$store.state.menu.tags
    },
  },
  data() {
    return {
      tags: []
    }
  },
  created() {
    this.tags = this.getTags
    console.log(this.tags)
  },
  methods: {
    clickTag(id) {
      console.log(id)
      console.log('click')
    },
    closeTag(id) {
      console.log(id)
      console.log('close')
    },
    onChange(e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

.tag {
  display: flex;
  flex-direction: row;
}

.mx-1 {
  margin-right: 10px;
}
</style>
