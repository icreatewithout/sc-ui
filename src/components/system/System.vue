<template>
  <div class="div-layout">
    <el-container>
      <el-aside>
        <el-menu
            :default-active="active"
            mode="vertical"
            @select="handleSelect"
            class="el-menu-vertical-demo"
        >
          <el-sub-menu v-for="item in menus" :key="item.id" :index="item.href==null?item.id:item.href">
            <template #title>
              <el-icon v-show="item.icon!==null && item.icon!==''" class="el-icon--left">
                <component :is="item.icon"/>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-if="item.children.length > 0" v-for="item in item.children" :key="item.id"
                          :index="item.href == null?item.id:item.href">
              <el-icon v-show="item.icon != null && item.icon !== ''" class="el-icon--left">
                <component :is="item.icon"/>
              </el-icon>
              <span>{{ item.name }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main style="padding-top: 0">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {get} from '../../request/request'
import {menus, menusByUser} from "../../request/api";
import * as icons from "@element-plus/icons-vue"

export default {
  name: "System",
  components: {},
  data() {
    return {
      menus: [],
      active: null,
      icons: []
    }
  },
  created() {
    this.findUserMenu()
    for (const name in icons) {
      this.icons.push(name)
    }
  },
  methods: {
    findUserMenu() {
      const path = this.$route.fullPath
      get(menusByUser).then(res => {
        this.menus = res.data
        this.active = path
      })
    },
    handleSelect(key, keyPath, item, routeResult) {
      if (key === '') {
        return false
      }
      this.$router.push(key)
    },
  }
}
</script>

<style scoped>
.el-aside {
  width: 200px;
}

.div-layout {
}
</style>