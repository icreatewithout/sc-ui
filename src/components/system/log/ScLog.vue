<template>
  <el-form :inline="true" :model="queryForm" class="demo-form-inline">
    <el-form-item label="业务名称">
      <el-input v-model="queryForm.userName" placeholder="请输业务名称"/>
    </el-form-item>
    <el-form-item label="IP">
      <el-input v-model="queryForm.requestIp" placeholder="请输入IP"/>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="queryForm.logType" placeholder="请选择状态">
        <el-option label="正常" value="1"/>
        <el-option label="异常" value="2"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="default" @click="onReset">重置</el-button>
      <el-button type="primary" @click="onQuery">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table
      :data="tableData"
      style="margin-top:8px;margin-bottom: 20px"
      border
  >
    <el-table-column prop="userName" label="用户"/>
    <el-table-column prop="bizName" label="业务名称"/>
    <el-table-column prop="descriptions" label="描述"/>
    <el-table-column prop="method" label="方法" width="450px"/>
    <el-table-column prop="requestIp" label="IP"/>
    <el-table-column prop="address" label="IP地址"/>
    <el-table-column prop="browser" label="设备"/>
    <el-table-column prop="time" label="时间"/>
    <el-table-column prop="logType" label="状态" :formatter="formatStatus"/>
    <el-table-column prop="result" label="操作" align="center">
      <template #default="scope">
        <el-button
            size="small"
            type="text"
            @click="show(scope.row,'1')"
        >
          <el-icon>
            <document/>
          </el-icon>
          参数
        </el-button>
        <el-button
            size="small"
            type="text"
            @click="show(scope.row,'2')"
        >
          <el-icon>
            <document/>
          </el-icon>
          结果
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

  <el-dialog
      v-model="openForm"
      :modal="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px"
  >
    <el-collapse v-model="name">
      <el-collapse-item :title="title" name="1">
        {{ res }}
      </el-collapse-item>
    </el-collapse>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="openForm = false">取消</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import {get} from "../../../request/request";
import {logs, getLog} from "../../../request/api";

export default {
  name: "ScLog",
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
      name: '1',
      title: '',
      openForm: false,
      res: '',
      total: 0,
      pageSize: 10,
      pageNum: 1,
      queryForm: {
        logType: null,
        bizName: null,
        requestIp: null
      },
      tableData: [],
    }
  },
  created() {
    this.findList()
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1
      this.findList()
    },
    handleCurrentChange(number) {
      this.pageNum = number
      this.findList()
    },
    findList() {
      this.queryForm['pageNum'] = this.pageNum
      this.queryForm['pageSize'] = this.pageSize
      get(logs, this.queryForm).then(res => {
        this.tableData = res.data.content
        this.total = res.data.totalElements
      })
    },
    onQuery() {
      this.pageNum = 1
      this.findList()
    },
    onReset() {
      this.queryForm.bizName = null;
      this.queryForm.logType = null;
      this.queryForm.requestIp = null;
      this.pageNum = 1
      this.findList()
    },
    formatStatus(row, column) {
      if (row.logType === '1') {
        return "正常日志"
      }
      if (row.logType === '2') {
        return "异常日志"
      }
    },
    show(row, type) {
      this.openForm = true
      if (type === '1') {
        this.title = '请求参数'
        this.res = row.params
      } else {
        this.title = '响应结果'
        if (row.logType === '1') {
          this.res = row.result
        }
        if (row.logType === '2') {
          this.res = row.exceptionDetail
        }
      }
    }
  }
}
</script>

<style scoped>
.el-pagination {
  padding: 10px 0;
  float: right;
}
</style>