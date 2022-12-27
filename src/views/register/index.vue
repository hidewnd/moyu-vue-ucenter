<template>
  <div class="register-page">
    <div class="title">注册</div>
    <div class="register-form-part">
      <el-form
        class="register-form"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        status-icon
        :inline-message="true"
        label-width="80px"
        size="default"
      >
        <el-form-item label="邮  箱" prop="email" :required="true">
          <el-input
            v-model="ruleForm.email"
            type="text"
            @blur="checkMailCode"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="mailCode">
          <el-input
            v-model="mailCode"
            type="text"
            @blur="checkMailCode"
            autocomplete="off"
          />
          <el-button
            type="primary"
            size="small"
            style="margin-left: 10px"
            @click="showVerification"
            :disabled="isMailCodeSendDisable"
            >{{ mailCodeSendBtnWords }}</el-button
          >
        </el-form-item>
        <el-form-item label="昵  称" prop="username" :required="true">
          <el-input
            v-model="ruleForm.username"
            type="text"
            :disabled="!isEmailCodeCompleted"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="密  码" prop="password" :required="true">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            :disabled="!isEmailCodeCompleted"
            placeholder="以字母开头，长度在6~16之间，只能包含字母、数字和下划线"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :required="true">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            placeholder="请再次输入以确认密码"
            :disabled="!isEmailCodeCompleted"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
            :disabled="!isEmailCodeCompleted"
          >
            注册
          </el-button>
          <span style="margin-left: 20px; color: #7e8c8d text-emphasis: none;"
            ><a href="/login">已注册？点击登录</a></span
          >
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
import { toRefs, reactive, ref } from "vue";
import { verifyEmail, verifyPassword } from "@/utils/toolsValidate";
import { ElMessage } from "element-plus";
import MD5 from "@/utils/md5";
import Verify from "@/components/verifition/Verify.vue";
import router from "@/router";
import { LoginRegisterApi, UserExApi } from "@/api/ucenter";
interface State {
  ruleForm: {
    email: string;
    username: string;
    password: string;
    checkPass: string;
    verifyCode: string;
  };
  isEmailCodeCompleted: boolean;
  isMailCodeSendDisable: boolean;
  mailCodeSendBtnWords: string;
  mailCode: string;
  rules: object;
}
export default {
  name: "Home",
  components: { Verify },
  setup() {
    const ruleFormRef = ref();
    const verifyRef = ref();
    const state = reactive<State>({
      ruleForm: {
        email: "",
        username: "",
        password: "",
        checkPass: "",
        verifyCode: "",
      },
      isEmailCodeCompleted: false,
      isMailCodeSendDisable: false,
      mailCodeSendBtnWords: "获取验证码",
      mailCode: "",
      rules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        username: [{ validator: checkName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
        checkPass: [{ validator: checkCheckPassword, trigger: "blur" }],
      },
    });
    // 提交注册
    function submitForm() {
      state.ruleForm.verifyCode = state.mailCode;
      state.ruleForm.password = new MD5().hex_md5(state.ruleForm.password);
      state.ruleForm.checkPass = state.ruleForm.password;
      ruleFormRef.value.validate((valid: boolean) => {
        if (valid) {
          LoginRegisterApi().register(state.ruleForm).then((data: any) => {
            if (data.code == 2000) {
              ElMessage.success(data.msg);
              router.push({
                path: "/login",
              });
            } else {
              ElMessage.error(data.msg);
            }
          });
        }
      });
    }
    // 发送验证码
    function doSendEmailCode(params: any) {
      ruleFormRef.value.validateField("email", (checked: boolean) => {
        if (checked) {
          UserExApi()
            .sendRegisterMail({
              verification: encodeURIComponent(params.captchaVerification),
              mail: state.ruleForm.email,
            })
            .then((data: any) => {
              if (data.code === 2000) {
                ElMessage.success("验证码发送成功");
                countDown();
              } else {
                ElMessage.error(data.msg);
              }
            })
            .catch((err) => {});
        }
      });
    }

    // 禁止重复点击
    function countDown() {
      let time = 60;
      state.isMailCodeSendDisable = true;
      let sendTimer = setInterval(() => {
        time--;
        if (time < 0) {
          clearInterval(sendTimer);
          state.mailCodeSendBtnWords = "获取验证码";
          state.isMailCodeSendDisable = false;
        } else {
          state.mailCodeSendBtnWords = "重新发送(" + time + "s)";
        }
      }, 1000);
    }

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
    // 校验用户名
    function checkName(rule: any, value: any, callback: any) {
      if (value == "") {
        callback(new Error("请输入用户名！"));
      } else callback();
    }
    // 校验密码
    function checkPassword(rule: any, value: any, callback: any) {
      if (value == "") {
        callback(new Error("请输入密码！"));
      } else callback();
      /*
 else if (!verifyPassword(value)) {
        callback(
          new Error(
            "密码以字母开头，长度在6~16之间，且只能包含字母、数字和下划线"
          )
        );
      } 
      */
    }
    // 二次校验密码
    function checkCheckPassword(rule: any, value: any, callback: any) {
      if (value == "") {
        callback(new Error("请输入密码！"));
      } else if (state.ruleForm.password != value) {
        callback(new Error("两次密码输入不一致！"));
      } else callback();
    }

    function checkMailCode() {
      // 检查邮箱和验证码是否有内容
      if (state.ruleForm.email || state.mailCode) {
        state.isEmailCodeCompleted = true;
      }
    }

    // 点击验证码按钮
    function showVerification() {
      verifyRef.value.show();
    }

    return {
      ruleFormRef,
      verifyRef,
      submitForm,
      doSendEmailCode,
      checkMailCode,
      showVerification,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.register-form-part {
  margin-top: 20px;
}
.register-form-part .el-input {
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
