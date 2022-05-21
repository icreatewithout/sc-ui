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
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.userName" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="queryForm.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"/>
            <el-option label="停用" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="onReset">重置</el-button>
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>

      <el-button-group class="ml-4">
        <el-button type="primary" @click="add">
          <el-icon class="el-icon--left">
            <document-add/>
          </el-icon>
          新增
        </el-button>
        <el-button type="danger" @click="del()">
          <el-icon class="el-icon--left">
            <delete/>
          </el-icon>
          删除
        </el-button>
      </el-button-group>
      <el-table
          :data="tableData"
          style="margin-top:8px;margin-bottom: 20px"
          border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="avatarUrl" label="头像">
          <template #default="scope">
            <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.avatarUrl"
                :initial-index="4"
                fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="账号"/>
        <el-table-column prop="nickName" label="昵称"/>
        <el-table-column prop="phone" label="手机"/>
        <el-table-column prop="status" label="状态" :formatter="formatStatus"/>
        <el-table-column label="操作" align="center" width="400px">
          <template #default="scope">
            <el-button
                size="small"
                type="warning"
                @click="resetPass(scope.row)"
            >
              <el-icon>
                <refresh-left />
              </el-icon>
              重置密码
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
      <el-pagination
          background :layout="layout"
          :page-sizes="pageSizes"
          :total="total"
          @size-change="handleSizeChange"
          :default-page-size="pageSize"
          @current-change="handleCurrentChange"
      />
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
    <el-form :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-tree-select
                v-model="form.deptId"
                :data="treeData"
                clearable check-strictly filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-switch v-model="form.status" active-value="1" inactive-value="2"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="角色">
        <el-checkbox-group v-model="form.roleIds">
          <el-checkbox
              v-for="item in allRole"
              :key="item.id"
              :label="item.id"
              :disabled="item.status!=='1'"
          >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.userName"/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickName"/>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone" type="phone"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" type="email"/>
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
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus'
import {del, get, post, put} from '../../../request/request'
import {
  treeDept,
  allRoles,
  users,
  saveUser,
  getUser,
  deleteUser, resetPass
} from "../../../request/api";

export default {
  name: "ScUser",
  props: {
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default() {
        return [2, 10, 20, 30, 50, 100]
      }
    },
  },
  data() {
    return {
      openForm: false,
      title: '',
      total: 0,
      pageSize: 10,
      pageNum: 1,
      queryForm: {
        deptId: null,
        userName: null,
        phone: null,
        status: null
      },
      form: {
        id: null,
        userName: null,
        phone: null,
        email: null,
        status: '1',
        nickName: null,
        avatarUrl: null,
        type: null,
        deptId: null,
        roleIds: [],
      },
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
      },
      treeData: [],
      allRole: [],
      selectId: null,
    }
  },
  created() {
    this.findList()
    this.getTreeDept()
    this.findAllRoles()
  },
  methods: {
    handleSelectionChange(row) {
      this.selectRowIds = row.join().toString()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1
      this.findList()
    },
    handleCurrentChange(number) {
      this.pageNum = number
      this.findList()
    },
    handleNodeClick(data) {
      this.pageNum = 1
      this.queryForm.deptId = data.id
      this.findList()
    },
    findAllRoles() {
      get(allRoles).then(res => {
        this.allRole = res.data
      })
    },
    getTreeDept() {
      get(treeDept).then(res => {
        this.treeData = res.data
      })
    },
    findList() {
      this.queryForm['pageNum'] = this.pageNum
      this.queryForm['pageSize'] = this.pageSize
      get(users, this.queryForm).then(res => {
        this.tableData = res.data.content
        this.total = res.data.totalElements
      })
    },
    add() {
      this.reset()
      this.openForm = true
      this.title = '新增用户'
    },
    edit(row) {
      this.reset()
      this.title = '修改[' + row.userName + ']'
      get(getUser + row.id).then(res => {
        this.form = res.data
        if (res.data.roleIds !== null && res.data.roleIds !== '') {
          this.form.roleIds = res.data.roleIds.split(',');
        } else {
          this.form.roleIds = []
        }
        this.openForm = true
      })
    },
    del(id) {
      console.log(id)
      let ids = null;
      if (id !== undefined) {
        ids = id;
      }
      if (this.selectId !== null) {
        ids = this.selectId
      }
      if (ids === null) {
        return ElMessage('请先选择要删除的数据行.')
      }
      this.onDelete(ids);
      this.selectId = null;
    },
    onDelete(data) {
      ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            del(deleteUser + data).then(res => {
              this.findList()
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
      this.form.roleIds = this.form.roleIds.join(',')
      if (this.form.id === null) {
        this.save(loading)
      } else {
        this.update(loading)
      }
    },

    save(loading) {
      post(saveUser, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.openForm = false
      }).catch(error => {
        loading.close()
      })
    },

    update(loading) {
      put(saveUser, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.openForm = false
      }).catch(error => {
        loading.close()
      })
    },
    resetPass(row){
      ElMessageBox.confirm('确定重置密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            put(resetPass + row.id).then(res => {
              if (res.data.code === 200){
                ElMessage.success(res.data)
              }
              loading.close()
            }).catch(error => {
              loading.close()
            })
          }
        },
      })
    },
    onQuery() {
      this.pageNum = 1
      this.findList()
    },
    onReset() {
      this.$refs.treeRef.setCheckedKeys([], false)
      this.queryForm.deptId = null
      this.queryForm.userName = null;
      this.queryForm.status = null;
      this.queryForm.phone = null;
      this.pageNum = 1
      this.findList()
    },
    formatStatus(row, column) {
      if (row.status === '1') {
        return "正常"
      }
      if (row.status === '2') {
        return "禁用"
      }
    },
    reset() {
      this.form = {
        id: null,
        userName: null,
        password: null,
        phone: null,
        email: null,
        status: '1',
        nickName: null,
        avatarUrl: null,
        type: null,
        deptId: null,
        roleIds: [],
      }
      this.title = ''
    },
  }
}
</script>

<style scoped>
.el-pagination {
  padding: 10px 0;
  float: right;
}
</style>
