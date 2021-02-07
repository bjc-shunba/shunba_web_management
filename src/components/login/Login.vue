<template>
  <div class="login_container" id="logon">
    <div class="logarea">
      <span class="title">顺巴用车后台登录</span>
      <el-form ref="loginFormRef" class="logform" :rules="loginFormRules" label-position="top" label-width="80px" :model="loginForm">
        <el-form-item class="login-formitem1" prop="username">
          <el-input style="width: 460px" v-model="loginForm.username" placeholder="请输入用户名" class="userinput" id="users">
            <img slot="prefix" src="./assets/user.png" style="margin-top: 10px; padding-left: 5px" width="28px" />
          </el-input>
        </el-form-item>
        <el-form-item class="login-formitem2" prop="password">
          <el-input style="width: 460px" type="password" v-model="loginForm.password" placeholder="请输入密码" id="password">
            <img slot="prefix" src="./assets/password.png" style="margin-top: 10px; padding-left: 5px" width="28px" />
          </el-input>
        </el-form-item>
        <el-button class="login-btn" style="margin-left: 10px; margin-right: 45px" @click="resetLoginForm">重置</el-button>
        <el-button class="login-btn" @click="login">登录</el-button>
      </el-form>
    </div>
    <img class="mascot-img" src="./assets/logon.png" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: ""
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
          // { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
          // { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;

        const { data: res } = await this.$http.post("/auth/login", this.loginForm);
        if (res.code !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功");
        // let userInfo = res.data.userInfo;
        // window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        window.sessionStorage.setItem("token", res.data.tokenVO.access_token);
        this.$router.push("/home");
      });
    }
  },
  created: function () {
    //回车键直接登录
    let that = this;
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which;
      //需要注意的：$("#logon").length的作用是如果不判断是在登录页，回车可能所有页面都生效，也就是无论在哪个页面敲回车都会直接登录
      if ($("#logon").length && keycode == 13) {
        that.login(); // 登录方法名
        return false;
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1400px;
  background-repeat: no-repeat;
  background-image: url("./assets/login.jpg");
  background-size: 100% 100%;
}
.logarea {
  position: absolute;
  top: 36%;
  right: 17.4%;
  z-index: 99;
}
.title {
  color: #3ac158;
  font-size: 30px;
  font-weight: 700;
}
.logform {
  margin-top: 48px;
}
::v-deep .el-form-item {
  margin-bottom: 30px;
}
::v-deep .el-button {
  width: 190px;
  height: 52px;
  border-radius: 25px;
  border: 2px solid #3ac158;
  font-size: 24px;
  color: #3ac158;
}
::v-deep .el-button:focus,
.el-button:hover {
  color: #fff;
  background-color: #3ac158;
}
::v-deep .el-input__inner {
  background-color: #edf0f7;
  height: 46px;
  font-size: 18px;
  padding-left: 52px;
  color: #666;
  border-radius: 20px;
}

.login-btn {
  margin-top: 10px;
}
.mascot-img {
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 700px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  // z-index: 99999999;
}
</style>
