<template>
  <div id="forgot-page">
    <div class="title">重置密码</div>
    <div class="forgot-form-part">
      <el-form
        class="register-form"
        ref="userFormRef"
        :rules="rules"
        :model="userForm"
        status-icon
        :inline-message="true"
        label-width="80px"
        size="default"
      >
        <el-form-item label="邮  箱" prop="email" :required="true">
          <el-input
            v-model="userForm.email"
            type="text"
            @blur="checkMailCode"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="mailCode" :required="true">
          <el-input
            v-model="userForm.verifyCode"
            type="text"
            @blur="checkMailCode"
            :disabled="mailVerify.isSendDisable"
            autocomplete="off"
          />
          <el-button
            type="primary"
            size="small"
            style="margin-left: 10px"
            @click="showVerification"
            :disabled="mailVerify.isSendDisable"
            >{{ mailVerify.sendBtnWords }}</el-button
          >
        </el-form-item>
        <el-form-item label="新密码" prop="password" :required="true">
          <el-input
            v-model="userForm.password"
            type="password"
            autocomplete="off"
            placeholder="以字母开头，长度在6~16之间，只能包含字母、数字和下划线"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
            :disabled="!mailVerify.isCompleted"
          >
            重置密码
          </el-button>
          <span v-if="isLogin">
            <a
              style="margin-left: 20px; color: #7e8c8d text-emphasis: none;"
              href="/login"
              >点击登录
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
        @success="doSendEmailCode"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue-demi";
import router from "@/router";
import MD5 from "@/utils/md5";
import Verify from "@/components/verifition/Verify.vue";
import { verifyEmail, verifyPassword } from "@/utils/toolsValidate";
import { ElMessage } from "element-plus";
import { LoginRegisterApi, UserExApi } from "@/api/ucenter";
interface State {
  userForm: {
    email: string;
    verifyCode: string;
    password: string;
  };
  mailVerify: {
    sendBtnWords: string;
    isSendDisable: boolean;
    isCompleted: boolean;
  };
  isLogin: boolean;
  rules: object;
}
export default {
  name: "Forgot",
  components: { Verify },
  setup() {
    const verifyRef = ref();
    const userFormRef = ref();
    const state = reactive<State>({
      userForm: {
        email: "",
        password: "",
        verifyCode: "",
      },
      rules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
      },
      mailVerify: {
        sendBtnWords: "获取验证码",
        isSendDisable: false,
        isCompleted: false,
      },
      isLogin: false,
    });

    // 邮箱校验
    function checkEmail(rule: any, value: any, callback: any) {
      if (value == "") {
        callback(new Error("请输入邮箱地址！"));
      } else {
        if (!verifyEmail(value)) {
          callback(new Error("请检查邮箱格式是否正确！"));
        } else callback();
      }
    }

    // 检查邮箱和验证码是否有内容
    function checkMailCode() {
      state.userForm.password = new MD5().hex_md5(state.userForm.password);
      if (state.userForm.email || state.userForm.verifyCode) {
        state.mailVerify.isCompleted = true;
      }
    }

    // 提交重置
    function submitForm() {
      // 检查邮箱
      userFormRef.value.validate((checked: boolean) => {
        if (checked) {
          LoginRegisterApi()
            .resetPassword(state.userForm)
            .then((data: any) => {
              if (data.code === 2000) {
                ElMessage.success(data.msg);
                setTimeout(() => {
                  router.push({ path: "/login" });
                }, 1500);
              } else {
                ElMessage.error(data.msg);
              }
            });
        }
      });
    }

    function showVerification() {
      verifyRef.value.show();
    }
    // 发送邮箱
    function doSendEmailCode(param: any) {
      userFormRef.value.validateField("email", (checked: boolean) => {
        if (checked) {
          UserExApi()
            .sendForgotMail({
              verification: encodeURIComponent(param.captchaVerification),
              mail: state.userForm.email,
            })
            .then((data: any) => {
              if (data.code === 2000) {
                ElMessage.success("验证码发送成功");
                countDown();
                state.mailVerify.isCompleted = true;
              } else {
                ElMessage.error(data.msg);
              }
            });
        }
      });
    }

    // 禁止重复点击
    function countDown() {
      let time = 60;
      state.mailVerify.isSendDisable = true;
      let sendTimer = setInterval(() => {
        time--;
        if (time < 0) {
          clearInterval(sendTimer);
          state.mailVerify.sendBtnWords = "获取验证码";
          state.mailVerify.isSendDisable = false;
        } else {
          state.mailVerify.sendBtnWords = "重新发送(" + time + "s)";
        }
      }, 1000);
    }

    onMounted(() => {
      let cookieArray = document.cookie.split("; ");
      for (const element of cookieArray) {
        let items = element.split("=");
        if (items[0] === "sob_token") {
          let token = items[1];
          if (token === "") {
            state.isLogin = false;
          } else {
            state.isLogin = true;
          }
        }
      }
    });

    return {
      verifyRef,
      userFormRef,
      checkMailCode,
      showVerification,
      doSendEmailCode,
      submitForm,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.forgot-form-part {
  margin-top: 20px;
}
.forgot-form-part .el-input {
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
