<template>
  <div class="con">
    <div style="padding-bottom: 60px;font-weight: bolder;letter-spacing: 2px;font-size: 36px">
      SC-DEV管理平台
    </div>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="demo-ruleForm"
        size="large"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-col :span="16">
          <el-input v-model="ruleForm.code"></el-input>
        </el-col>
        <el-col :span="8">
          <div style="height: 40px;padding-left: 5px">
            <el-image :src="img.img" class="el-img" @click="createCode"/>
          </div>
        </el-col>
      </el-form-item>
      <div class="register">
        <el-button
            type="primary" size="large"
            class="btn"
            :loading="loading"
            @click="submitForm()">
          登录
        </el-button>
      </div>
      <div style="float: left;padding-top: 4px;">
        <el-link type="danger">*请妥善保存账号密码</el-link>
      </div>
      <div class="to-login">
        <el-link type="primary" @click="toRegister()">没有帐号，联络管理员</el-link>
      </div>
    </el-form>
  </div>

</template>

<script>
import {get, post} from '../../request/request'
import {getCode, login} from "../../request/api";

export default {
  name: "Login",
  data() {
    const ckCode = (rule, value, callback) => {
      if (this.img.value !== value) {
        callback(new Error("输入的验证码不正确"));
      } else {
        callback();
      }
    };
    return {
      img: {},
      ruleForm: {
        username: '',
        password: '',
        code: '',
        imgId: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur',},
          {min: 3, max: 10, message: '长度在 3 到 10之间', trigger: 'blur',},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur',},
          {max: 20, message: '超过最大长度', trigger: 'blur',},
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur',},
          {required: true, validator: ckCode, trigger: 'blur',},
        ],
      },
      loading: false,
      open: false
    }
  },

  created() {
    this.createCode()
  },
  methods: {
    toRegister() {
      this.$router.push({path: '/register'})
    },
    resetForm() {
      this.$refs.ruleFormRef.resetForm()
    },
    createCode() {
      get(getCode).then(res => {
            this.img = res.data
            this.ruleForm.imgId = res.data.id
          }
      )
    },
    submitForm() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.ruleForm).then(res => {
            if (res.code === 200) {
              this.loading = false
              this.$store.dispatch('GetInfo', this.ruleForm).then(() => {
                this.$router.push("/")
              })
            } else {
              this.loading = false
              this.createCode()
            }
          }).catch(() => {
            this.loading = false
            this.createCode()
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
.con {
  align-items: center;
  text-align: center;
}

.el-img {
  height: 40px;
  width: 100%;
  border-radius: 4px;
}

.register {
  width: 100%;
  padding-top: 20px
}

.btn {
  width: 100%;
  letter-spacing: 10px;
  font-size: 14px;
  font-weight: bolder
}

.to-login {
  float: right;
  padding-top: 4px;
}


@media screen and (min-width: 320px) and (max-width: 767px) {
  .con {
    padding-top: 50px;
    padding-left: 5%;
    padding-right: 5%;
  }
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  .con {
    width: 50%;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
}

@media screen and (min-width: 992px) and (max-width: 1199px) {
  .con {
    width: 35%;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
}

@media screen and (min-width: 1200px) and (max-width: 1919px) {
  .con {
    width: 25%;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
}

@media screen and (min-width: 1920px) {
  .con {
    width: 25%;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
}
</style>
