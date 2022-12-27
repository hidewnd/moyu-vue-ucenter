<template>
  <div id="index-part">
    <!-- {{$t("msg.test")}} -->
    <div v-if="hasLogin" class="login-part">
      <div class="avatar-part">
        <img :src="userVo.avatar" />
      </div>
      <div class="user-name-part">
        <span>{{ userVo.userName }}</span>
      </div>
      <div class="action-part">
        <el-button type="primary" @click="toPage('forgot')" size="small">
          重置密码
        </el-button>
        <el-button type="danger" @click="logout" size="small">
          退出登录
        </el-button>
      </div>
    </div>
    <div v-else class="logout-part">
      <div class="no-login-tips">
        <el-button type="primary" @click="toPage('login')" size="small">
          登录
        </el-button>
        <el-button type="primary" @click="toPage('register')" size="small">
          注册
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue-demi";
import router from "@/router";
import { ElMessage } from "element-plus";
import { LoginRegisterApi } from "@/api/ucenter";
interface State {
  userVo: {
    avatar: string;
    userName: string;
  };
  hasLogin: boolean;
}
export default {
  name: "Home",
  components: {},
  setup() {
    const state = reactive<State>({
      userVo: {
        avatar: "",
        userName: "",
      },
      hasLogin: false,
    });

    // 登出
    function logout() {
      LoginRegisterApi()
        .logout()
        .then((data: any) => {
          if (data.code === 2000) {
            ElMessage.success("退出登录成功");
            window.localStorage.setItem("avatar", "");
            window.localStorage.setItem("userName", "");
            router.push({
              path: "/login",
            });
          }
        });
    }
    function toPage(page: string) {
      if (page === "login") {
        router.push({ path: "/login" });
      } else if (page === "register") {
        router.push({ path: "/register" });
      } else if (page === "forgot") {
        router.push({ path: "/forgot" });
      }
    }

    // 检查是否未登录
    function checkLogin() {
      let cookieArray = document.cookie.split("; ");
      for (const element of cookieArray) {
        let items = element.split("=");
        if (items[0] === "sob_token") {
          let token = items[1];
          if (token === "") {
            state.hasLogin = false;
          } else {
            if (!state.userVo.avatar || !state.userVo.userName) {
              state.hasLogin = false;
            } else {
              state.hasLogin = true;
            }
          }
        }
      }
    }
    onMounted(() => {
      var avator = window.localStorage.getItem("avatar");
      var userName =  window.localStorage.getItem("userName");
      state.userVo.avatar = avator == null ? '' : avator;
      state.userVo.userName = userName==null ? '' : userName;
      checkLogin();
    });

    return {
      logout,
      toPage,
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.avatar-part img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.user-name-part span {
  font-size: 28px;
  color: #4d3d4d;
}
.action-part {
  margin-top: 10px;
}
.centent-center {
  text-align: center;
}
.no-login-tips {
  text-align: center;
}
</style>
