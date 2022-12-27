<template>
  <!-- 头部 -->
  <Header></Header>
  <!-- 中间内容 -->
  <div class="content-part">
    <router-view />
  </div>
  <!-- 底部 -->
  <Footer></Footer>
</template>
<script lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "App",
  components: { Header, Footer },
  setup() {
    return {};
  },
};
</script>

<style lang="scss">
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  background: #F2F2F2;
}
.content-part {
  width: 1024px;
  margin: 30px auto 0;
  padding: 10px;
  background: white;
  
}
.title {
  font-size: 24px;
  font-weight: 600;
}
</style>
