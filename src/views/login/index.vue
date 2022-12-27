<template>
  <div class="login-part">
    <div class="title">登录</div>
    <div class="login-form-part">
      <el-form
        class="register-form"
        ref="ruleFormRef"
        :model="loginForm"
        :rules="rules"
        status-icon
        :inline-message="true"
        label-width="80px"
        size="default"
      >
        <el-form-item label="账  号" prop="username" :required="true">
          <el-input
            v-model="loginForm.username"
            type="text"
            autocomplete="off"
            placeholder="请输入邮箱或用户名"
          />
        </el-form-item>
        <el-form-item label="密  码" prop="password" :required="true">
          <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showVerification"> 登录 </el-button>
        </el-form-item>
        <el-form-item>
          <span>
            <a
              style="margin-left: 20px; color: #7e8c8d text-emphasis: none;"
              href="/register"
              >未注册？点击注册
            </a>
          </span>
          <span>
            <a
              style="margin-left: 20px; color: #7e8c8d text-emphasis: none;"
              href="/forgot"
              >忘记密码？立即重置
            </a>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="verify-part">
      <Verify
        ref="verifyRef"
        captchaType="blockPuzzle"
        :imgSize="{ width: '400px', height: '200px' }"
        @success="doLogin"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, ref } from "vue";
import { verifyEmail, verifyPassword } from "@/utils/toolsValidate";
import { ElMessage } from "element-plus";
import Verify from "@/components/verifition/Verify.vue";
import router from "@/router";
import MD5 from "@/utils/md5";
import { LoginRegisterApi } from "@/api/ucenter";
interface State {
  loginForm: {
    username: string;
    password: string;
    verifyCode: string;
  };
  mailCodeSendBtnWords: string;
  rules: object;
}
export default {
  name: "Login",
  components: { Verify },
  setup() {
    const ruleFormRef = ref();
    const verifyRef = ref();
    const state = reactive<State>({
      loginForm: {
        username: "",
        password: "",
        verifyCode: "",
      },
      mailCodeSendBtnWords: "获取验证码",
      rules: {
        username: [{ validator: checkName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
      },
    });

    // 校验用户名
    function checkName(rule: any, value: any, callback: any) {
      if (value === "") {
        callback(new Error("请输入用户名或密码！"));
      } else {
        callback();
      }
    }
    // 校验密码
    function checkPassword(rule: any, value: any, callback: any) {
      if (value === "") {
        callback(new Error("请输入密码！"));
      } else callback();
    }
    // 显示验证码
    function showVerification() {
      verifyRef.value.show();
    }

    function doLogin(params: any) {
      ruleFormRef.value.validate((checked: boolean) => {
        if (checked) {
          state.loginForm.password = new MD5().hex_md5(
            state.loginForm.password
          );
          state.loginForm.verifyCode = params.captchaVerification;
          LoginRegisterApi()
            .login(state.loginForm)
            .then((data: any) => {
              if (data.code === 2000) {
                ElMessage.success("登录成功");
                let userVo: any = data.obj;
                window.localStorage.setItem("userName", userVo.userName);
                window.localStorage.setItem("avatar", userVo.avatar);
                router.push({ path: "/home" });
              } else {
                ElMessage.error(data.msg);
              }
              state.loginForm.password = "";
            })
            .catch((err) => {
              ElMessage.error(err.msg);
            });
        }
      });
    }

    return {
      ruleFormRef,
      verifyRef,
      showVerification,
      doLogin,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.login-form-part {
  margin-top: 20px;
}
.login-form-part .el-input {
  width: 30%;
}

/*正常的未被访问过的链接*/
a:link {
  color: #7e8c8d;
  text-decoration: none;
}
/*已经访问过的链接*/
a:visited {
  color: #7e8c8d;
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
a:hover {
  color: #7e8c8d;
  text-decoration: none;
}
/* 正在点击的链接，鼠标在元素上按下还没有松开*/
a:active {
  color: #7e8c8d;
  text-decoration: none;
}
/* 获得焦点的时候 鼠标松开时显示的颜色*/
a:focus {
  color: #7e8c8d;
  text-decoration: none;
}
</style>
