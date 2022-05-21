<template>
  <div>
    <el-button-group class="ml-4">
      <el-button type="primary" @click="addCategory">
        <el-icon class="el-icon--left">
          <document-add/>
        </el-icon>
        新增
      </el-button>
    </el-button-group>
    <el-table
        :data="tableData"
        style="width: 100%; margin-top:8px;margin-bottom: 20px"
        row-key="id"
        border
        :default-expand-all="false"
    >
      <el-table-column prop="name" label="名称" width="240">
        <template #default="scope">
          <el-icon v-if="scope.row.icon!==null && scope.row.icon!==''" class="el-icon--left">
            <component :is="scope.row.icon"/>
          </el-icon>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="formatType" width="100"/>
      <el-table-column prop="icon" label="图标" width="150"/>
      <el-table-column prop="href" label="路由" width="150"/>
      <el-table-column prop="path" label="组件"/>
      <el-table-column prop="permission" label="权限标识" width="120"/>
      <el-table-column prop="isShow" label="是否显示" :formatter="formatShow" align="center" width="100"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button v-show="scope.row.type!=='3'"
                     size="small"
                     type="primary"
                     @click="addChild(scope.row)"
          >
            <el-icon>
              <document-add/>
            </el-icon>
            新增
          </el-button>
          <el-button
              size="small"
              type="primary"
              @click="edit(scope.row)"
          >
            <el-icon>
              <edit/>
            </el-icon>
            修改
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="del(scope.row.id)"
          >
            <el-icon>
              <delete/>
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="openCategory"
        :title="title"
        :modal="true"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="600px"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" readonly>
            <template #append>
              <el-button @click="openSelectIcons">
                选择图标
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="form.isShow" active-value="1" inactive-value="2"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="openCategory = false">取消</el-button>
          <el-popconfirm
              confirm-button-text="提交"
              cancel-button-text="取消"
              title="确认提交吗?"
              @confirm="submit"
          >
            <template #reference>
              <el-button type="primary">提交</el-button>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>

    <el-dialog
        v-model="openChild"
        :title="title"
        :modal="true"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="600px"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="目录" v-show="show">
          <el-select v-model="form.parentId" size="default" placeholder="请选择状态">
            <el-option v-for="item in typeMenu" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="form.type==='2'?'菜单名称':'按钮名称'">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="路由">
          <el-input v-model="form.href"/>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.path"/>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="form.permission"/>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" readonly>
            <template #append>
              <el-button @click="openSelectIcons">
                选择图标
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.isShow" active-value="1" inactive-value="2"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="openChild = false">取消</el-button>
          <el-popconfirm
              confirm-button-text="提交"
              cancel-button-text="取消"
              title="确认提交吗?"
              @confirm="submit"
          >
            <template #reference>
              <el-button type="primary">提交</el-button>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>

    <el-dialog
        v-model="openIcons"
        title="选择图标"
        :modal="true"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="700px">
      <ul v-infinite-scroll="()=>{}" class="infinite-list" style="overflow: auto">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in icons" :key="item">
            <el-card class="box-card" style="height: 100px;margin-bottom: 10px">
              <div class="inline-flex inline-flex1" :style="{boxShadow: `--el-box-shadow-lighter`}">
                <el-icon :size="30">
                  <component :is="item"/>
                </el-icon>
                <el-button type="text" @click="selectIcon(item)">{{ item }}</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import {ElLoading, ElMessageBox} from 'element-plus'
import {del, get, post, put} from '../../../request/request'
import {deleteMenu, getMenu, menus, saveMenu, typeMenus} from "../../../request/api";
import * as icons from "@element-plus/icons-vue"

export default {
  name: "Menu",
  components: {},
  data() {
    return {
      tableData: [],
      openCategory: false,
      openChild: false,
      openIcons: false,
      title: '',
      form: {
        id: null,
        parentId: null,
        name: null,
        icon: null,
        href: null,
        path: null,
        permission: null,
        type: "1",// 1目录2菜单3按钮
        isShow: "1",// 1目录2菜单3按钮
      },
      queryForm: {},
      icons: [],
      typeMenu: [],
      show: false
    }
  },
  created() {
    this.findList()
    for (const name in icons) {
      this.icons.push(name)
    }
  },
  methods: {
    findList() {
      get(menus).then(res => {
        this.tableData = res.data
      })
    },
    addCategory(row) {
      this.reset()
      this.openCategory = true
      this.title = "新增目录"
    },
    addChild(row) {
      this.reset()
      this.title = "添加[" + row.name + "]的子节点"
      row.type === '1' ? this.form.type = "2" : this.form.type = "3"
      this.form.parentId = row.id
      this.openChild = true
    },
    edit(row) {
      this.reset()
      this.title = '修改[' + row.name + ']'
      get(getMenu + row.id).then(res => {
        this.form = res.data
        if (res.data.type === '1') {
          this.openCategory = true
        } else {
          this.openChild = true
          if (res.data.type === '2') {
            this.show = true
            this.getMenusByType()
          }
        }
      })
    },
    getMenusByType() {
      get(typeMenus, {type: '1'}).then(res => {
        this.typeMenu = res.data
      })
    },
    del(id) {
      ElMessageBox.confirm('确定删除吗，她的子节点也一同被删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            del(deleteMenu + id).then(res => {
              this.findList()
              loading.close()
            }).catch(error => {
              loading.close()
            })
          }
        },
      })
    },
    submit() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      if (this.form.id !== null) {
        this.update(loading)
      } else {
        this.save(loading)
      }
    },

    save(loading) {
      post(saveMenu, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.openCategory === true ? this.openCategory = false : this.openChild = false
      }).catch(error => {
        loading.close()
      })
    },

    update(loading) {
      put(saveMenu, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.openCategory === true ? this.openCategory = false : this.openChild = false
      }).catch(error => {
        loading.close()
      })
    },

    formatType(row, column) {
      if (row.type === '1') {
        return "目录"
      }
      if (row.type === '2') {
        return "菜单"
      }
      if (row.type === '3') {
        return "按钮"
      }
    },

    formatShow(row, column) {
      if (row.isShow === '1') {
        return "显示"
      }
      if (row.isShow === '2') {
        return "隐藏"
      }
    },

    reset() {
      this.form = {
        id: null,
        parentId: null,
        name: null,
        path: null,
        icon: null,
        href: null,
        permission: null,
        type: '1',// 1目录2菜单3按钮
        isShow: '1',// 1目录2菜单3按钮
      }
      this.title = ''
      this.typeMenu = []
      this.show = false
    },
    openSelectIcons(e) {
      this.openIcons = true
    },
    selectIcon(name) {
      this.openIcons = false
      this.form.icon = name
    }
  }
}
</script>

<style scoped>
.inline-flex1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
}

.infinite-list {
  height: 400px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>