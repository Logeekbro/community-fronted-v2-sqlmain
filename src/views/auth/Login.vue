<template>
  <div class="columns py-6">
    <div class="column is-half is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          用户登录
        </div>
        <div>
          <verify :verifyVisible="verifyVisible" @handleClose="handleClose"
            @doRealAction="loginWithToken"></verify>
          <el-form v-loading="loading" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
            class="demo-ruleForm">
            <el-form-item label="账号" prop="account">
              <el-input v-model="ruleForm.account"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="10天免登录" prop="delivery">
              <el-switch v-model="ruleForm.rememberMe"></el-switch>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Verify from '@/components/Verify'

export default {
  name: "Login",
  components: { Verify },
  data() {
    return {
      redirect: null,
      loading: false,
      verifyVisible: false,
      ruleForm: {
        account: "",
        password: "",
        rememberMe: false,
      },
      accessToken: "",
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.accessToken == "") {
            this.verifyVisible = true
            return false
          }
          this.loading = true;
          this.ruleForm.accessToken = this.accessToken
          this.$store
            .dispatch("user/login", this.ruleForm)
            .then(() => {
              // this.msg.success("登录成功")
              setTimeout(() => {
                this.loading = false;
                this.$router.push({ path: this.redirect || "/" });
              }, 0.1 * 1000);
            })
            .catch(err => {
              if(err.message != "用户名或密码错误") {
                this.accessToken = ''
              }
              this.loading = false
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.accessToken = ""
    },
    handleClose() {
      this.verifyVisible = false
    },
    loginWithToken(token) {
      this.accessToken = token
      this.submitForm('ruleForm')
    }
  },
};
</script>

<style scoped>
</style>