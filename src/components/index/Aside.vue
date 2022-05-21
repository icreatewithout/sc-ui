<template>
  <div class="menu">
    <el-row class="tac">
      <el-col :span="24">
        <div style="align-items: center;padding-left: 20px;padding-top: 20px">
          SC
        </div>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            default-active="1"
            text-color="#fff"
            unique-opened
            class="el-menu-vertical-demo"
            :collapse="getExpand"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-menu-item index="1">Processing Center</el-menu-item>
          <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" disabled>Info</el-menu-item>
          <el-menu-item index="4">Orders</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  Document,
  Menu,
  Location,
  Setting,
} from '@element-plus/icons-vue'


const menus = [
  {id: '1', name: '菜单1', url: '/index', icon: '', type: '1', index: '1', children: [
      {id: '5', name: '菜单1-1', url: '/index', icon: '', type: '2', index: '1-1'},
      {id: '6', name: '菜单1-2', url: '/index', icon: '', type: '2', index: '1-2'},
      {id: '7', name: '菜单1-3', url: '/index', icon: '', type: '2', index: '1-4'},
    ]
  },
  {id: '2', name: '菜单2', url: '/index', icon: '', type: '1', index: '2',children: [
      {id: '8', name: '菜单2-1', url: '/index', icon: '', type: '2', index: '2-1'},
      {id: '9', name: '菜单2-2', url: '/index', icon: '', type: '2', index: '2-2'},
      {id: '10', name: '菜单2-3', url: '/index', icon: '', type: '2', index: '2-4'},
    ]},
  {id: '3', name: '菜单3', url: '/index', icon: '', type: '1', index: '3'},
  {id: '4', name: '菜单4', url: '/index', icon: '', type: '1', index: '4'}
]

export default {
  name: "Aside",
  components: {Setting, Location, Menu, Document},
  computed: {
    getExpand() {
      return this.$store.state.menu.expand
    },
  },
  data() {
    return {
      menus: menus
    }
  },
  created() {

  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
.tac {
  width: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  height: 100%;
}

.menu {
  height: 100%;
  background-color: #545c64;
  color: #fff;
}
</style>
