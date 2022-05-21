<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/system">系统管理</el-menu-item>
    <div style="position: absolute;right: 0;height:56px;display: flex;align-items: center">
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          <el-avatar shape="square" :size="30" :src="info.avatarUrl"/>
          <el-icon class="el-icon--right"><arrow-down/></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="uCenter">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>
  <el-dialog
      v-model="openForm"
      title="我的"
      :modal="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px"
  >

    <el-tabs type="border-card">
      <el-tab-pane label="个人信息">
        <el-form
            label-width="100px"
            label-position="top"
            style="max-width: 460px"
        >
          <el-form-item label="用户名">
            <el-input disabled v-model="info.userName"/>
          </el-form-item>
          <el-form-item label="手机">
            <el-input disabled v-model="info.phone"/>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                name="file"
                :headers="headers"
                :action="upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="info.avatarUrl" :src="info.avatarUrl" class="avatar"/>
              <el-icon v-else class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="80px" label-position="left">
          <el-form-item label="原密码" prop="password" required size="default" clearable>
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password1" required size="default" clearable>
            <el-input v-model="form.password1" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password2" required size="default" clearable>
            <el-input v-model="form.password2" type="password"></el-input>
          </el-form-item>
          <el-footer style="padding-top: 10px">
            <el-button style="width: 100%" type="primary" size="default" class="btn" :loading="loading"
                       @click="submitForm()">提交
            </el-button>
          </el-footer>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="info" size="default" @click="openForm = false">取消</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script>

import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import {put} from '../../request/request';
import {changePass, updateAvatar, upload} from '../../request/api';
import {getByKey, getToken} from "../../store/cookie";

export default {
  name: "Header",
  components: {},
  computed: {
    getStatus() {
      return this.$store.state.user.status
    },
    getName() {
      return this.$store.state.user.name
    },
    getInfo() {
      return this.$store.state.user.info
    },
    getToken() {
      return this.$store.state.user.token
    }
  },
  data() {
    const reCkPassword = (rule, value, callback) => {
      if (this.form.password1 !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      upload: upload,
      activeIndex: '/',
      openForm: false,
      imageUrl: null,
      info: null,
      form: {
        password: '',
        password1: '',
        password2: '',
      },
      rules: {
        password: [
          {required: true, message: '请输入原密码', trigger: 'blur',},
          {max: 20, message: '超过最大长度', trigger: 'blur',},
        ],
        password1: [
          {required: true, message: '请输入新密码', trigger: 'blur',},
          {max: 20, message: '超过最大长度', trigger: 'blur',},
        ],
        password2: [
          {required: true, message: '请输入新密码', trigger: 'blur',},
          {required: true, validator: reCkPassword, trigger: 'blur',},
        ],
      },
    }
  },
  created() {
    const path = this.$route.fullPath
    let matched = this.$route.matched
    for (let i in matched) {
      if (matched[i].redirect === path) {
        this.activeIndex = matched[i].path
        break
      }
      if (matched[i].children.length > 0) {
        for (let j in matched[i].children) {
          if (matched[i].children[j].path === path) {
            this.activeIndex = matched[i].path
            break
          }
        }
      }
    }
    this.info = JSON.parse(getByKey('info'))
    if (this.info.avatarUrl === null) {
      this.info.avatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  methods: {
    handleSelect(key, keyPath, item, routeResult) {
      this.$router.push(key)
    },
    uCenter() {
      this.openForm = true
    },
    logout() {
      ElMessageBox.confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            this.$store.dispatch('Logout').then(() => {
              location.reload()
            })
          }
        },
      })
    },
    beforeAvatarUpload(rawFile) {
      console.log(rawFile.type)
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('头像文件格式支持JPG、PNG')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小不能超过2M!')
        return false
      }
      return true
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.info.avatarUrl = URL.createObjectURL(file.raw)
        put(updateAvatar + res.data.id).then(response => {
          if (response.code === 200) {
            this.$store.dispatch('GetInfo', {})
          } else {
            ElMessage.error('头像更新失败!')
          }
        })
      }
    },
    submitForm() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          const data = {
            password: this.form.password,
            password1: this.form.password1,
            password2: this.form.password2,
          }
          put(changePass, data).then(res => {
            if (res.code === 200) {
              this.$store.dispatch('Logout').then(() => {
                this.$router.push("/login")
              })
            }
          })
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>