<template>
  <el-row>
    <el-col :span="4" style="padding-right: 10px">
      <el-tree
          ref="treeRef"
          node-key="id"
          default-expand-all
          :draggable="true"
          :expand-on-click-node="false"
          highlight-current
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
      />
    </el-col>
    <el-col :span="20">
      <el-button-group class="ml-4">
        <el-button type="primary" @click="add">
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
        <el-table-column prop="name" label="名称" width="240"/>
        <el-table-column prop="code" label="标识" width="240"/>
        <el-table-column prop="sort" label="排序" width="100"/>
        <el-table-column prop="status" label="状态" :formatter="formatStatus" align="center" width="100"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
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
    </el-col>
  </el-row>
  <el-dialog
      v-model="openForm"
      :title="title"
      :modal="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="上级部门">
        <el-tree-select v-model="form.parentId" :data="treeData" clearable check-strictly filterable/>
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" active-value="1" inactive-value="2"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="openForm = false">取消</el-button>
          <el-popconfirm
              confirm-button-text="提交"
              cancel-button-text="取消"
              title="确认提交吗?"
              @confirm="onSubmit"
          >
            <template #reference>
              <el-button type="primary">提交</el-button>
            </template>
          </el-popconfirm>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import {ElLoading, ElMessageBox} from 'element-plus'
import {del, get, post, put} from '../../../request/request'
import {depts, getDept, saveDept, deleteDept, treeDept} from "../../../request/api";

export default {
  name: "Dept",
  data() {
    return {
      tableData: [],
      openForm: false,
      title: '',
      form: {
        id: null,
        parentId: null,
        name: null,
        sort: null,
        status: '1',
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
      },
      treeData: [],
      selectId: null,
      selectName: null,
    }
  },
  created() {
    this.findList()
    this.getTreeDept()
  },
  methods: {
    findList() {
      get(depts).then(res => {
        this.tableData = res.data
      })
    },
    getTreeDept() {
      get(treeDept).then(res => {
        this.treeData = res.data
      })
    },
    handleNodeClick(data) {
      if (data.id === '0') {
        this.selectId = null
        this.selectName = null
      } else {
        this.selectId = data.id
        this.selectName = data.name
      }
    },
    add(row) {
      this.reset()
      this.title = this.selectName === null ? '新增部门' : '新增[' + this.selectName + ']的下级部门'
      this.form.parentId = this.selectId
      this.openForm = true
    },
    edit(row) {
      this.reset()
      this.title = '修改[' + row.name + ']'
      get(getDept + row.id).then(res => {
        this.form = res.data
        this.openForm = true
      })
    },
    del(id) {
      ElMessageBox.confirm('确定删除吗，如有下级节点存在无法删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            del(deleteDept + id).then(res => {
              if (res.code === 200) {
                this.findList()
              }
              this.getTreeDept()
              loading.close()
            }).catch(error => {
              loading.close()
            })
          }
        },
      })
    },
    onSubmit() {
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
      post(saveDept, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.openForm = false
        this.getTreeDept()
      }).catch(error => {
        loading.close()
      })
    },

    update(loading) {
      put(saveDept, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.openForm = false
        this.getTreeDept()
      }).catch(error => {
        loading.close()
      })
    },

    formatStatus(row, column) {
      if (row.status === '1') {
        return "显示"
      }
      if (row.status === '2') {
        return "隐藏"
      }
    },

    reset() {
      this.form = {
        id: null,
        parentId: null,
        name: null,
        status: '1',
        sort: null,
      }
      this.title = ''
    },
  }
}
</script>

<style scoped>

</style>