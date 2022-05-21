<template>
  <el-form :inline="true" :model="queryForm" class="demo-form-inline">
    <el-form-item label="描述">
      <el-input size="default" v-model="queryForm.name" placeholder="请输入角色名称"/>
    </el-form-item>
    <el-form-item label="角色">
      <el-input size="default" v-model="queryForm.code" placeholder="请输入角色值"/>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="queryForm.status" size="default" placeholder="请选择状态">
        <el-option label="启用" value="1"/>
        <el-option label="禁用" value="2"/>
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
    <el-table-column type="selection" width="55"/>
    <el-table-column prop="name" label="描述" width="180"/>
    <el-table-column prop="code" label="角色值" width="180"/>
    <el-table-column prop="status" label="状态" width="180" align="center" :formatter="formatStatus"/>
    <el-table-column prop="sort" label="排序" width="180"/>
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
  <el-pagination
      background
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      :default-page-size="pageSize"
      @current-change="handleCurrentChange"
  />
  <el-dialog
      v-model="openForm"
      :title="title"
      :modal="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="描述">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="角色值">
        <el-input v-model="form.code"/>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" type="number"/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.status" active-value="1" inactive-value="2"/>
      </el-form-item>
      <el-form-item label="选择菜单">
        <el-tree
            ref="treeRef"
            :data="menus"
            node-key="id"
            default-expand-all
            :props="defaultProps"
            show-checkbox
            :check-strictly="true"
            @check="treeCheck"
            :default-checked-keys="checkedKeys"
        />
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="info" size="default" @click="openForm = false">取消</el-button>
          <el-popconfirm
              confirm-button-text="提交"
              cancel-button-text="取消"
              title="确认提交吗?"
              @confirm="onSubmit"
          >
            <template #reference>
              <el-button size="default" type="primary">提交</el-button>
            </template>
          </el-popconfirm>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import {del, get, post, put} from '../../../request/request'
import {roles, getRole, saveRole, deleteRole, treeMenus, saveMenu, getMenu, deleteMenu} from "../../../request/api";
import {ElLoading, ElMessage, ElMessageBox, ElTree} from "element-plus";

export default {
  name: "Role",
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
      selectId: null,
      total: 0,
      pageNum: 1,
      pageSize: 2,
      queryForm: {
        name: null,
        code: null,
        status: null
      },
      tableData: [],
      menus: [
        {id: null, name: "无数据", disabled: true, children: []}
      ],
      openForm: false,
      title: '',
      form: {
        id: null,
        name: null,
        code: null,
        status: '1',
        sort: null,
        checkedKeys: null
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
      },
      checkedKeys: []
    }
  },
  created() {
    this.getMenus()
    this.findList()
  },
  methods: {
    handleSelectionChange(row) {
      this.selectId = row.join().toString()
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
    treeCheck(node, check) {
      this.form.checkedKeys = check.checkedKeys.join()
    },
    onQuery() {
      this.pageNum = 1
      this.findList()
    },
    onReset() {
      this.queryForm.name = null;
      this.queryForm.status = null;
      this.pageNum = 1
      this.findList()
    },
    findList() {
      this.queryForm['pageNum'] = this.pageNum
      this.queryForm['pageSize'] = this.pageSize
      get(roles, this.queryForm).then(res => {
        this.tableData = res.data.content
        this.total = res.data.totalElements
      })
    },
    getMenus() {
      get(treeMenus, {}).then(res => {
        if (res.data.length > 0) {
          this.menus = res.data
        }
      })
    },
    add() {
      this.reset()
      this.openForm = true
      this.title = "添加角色"
      if (this.$refs.treeRef !== undefined) {
        this.$refs.treeRef.setCheckedKeys([], false)
      }
    },
    edit(row) {
      this.reset()
      this.title = '修改[' + row.name + ']'
      get(getRole + row.id).then(res => {
        this.form = res.data
        this.openForm = true
        if (res.data.checkedKeys !== null) {
          this.checkedKeys = res.data.checkedKeys.split(',');
        }
      })
    },
    del(id) {
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
            del(deleteRole + data).then(res => {
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
      if (this.form.id === null) {
        this.save(loading)
      } else {
        this.update(loading)
      }
    },
    save(loading) {
      post(saveRole, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.$refs.treeRef.setCheckedKeys([], false)
        this.openForm = false
      }).catch(error => {
        loading.close()
      })
    },
    update(loading) {
      put(saveRole, this.form).then(res => {
        this.reset()
        this.findList()
        loading.close()
        this.$refs.treeRef.setCheckedKeys([], false)
        this.openForm = false
      }).catch(error => {
        loading.close()
      })
    },
    formatStatus(row, column) {
      if (row.status === '1') {
        return "开启"
      }
      if (row.status === '2') {
        return "禁用"
      }
    },
    reset() {
      this.form = {
        id: null,
        name: null,
        code: null,
        status: '1',
        sort: null,
        checkedKeys: null
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