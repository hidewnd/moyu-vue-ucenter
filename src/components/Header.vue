<template>
  <div class="header">
    <div class="header-center-part">
      <div class="header-logo-part">摸鱼君-用户中心</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Header",
  comments: {},
  setup() {},
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 50px;
  background-color: #0084ff;
}
.header-center-part {
  margin: 0 auto;
  width: 1024px;
}
.header-logo-part {
  color: white;
  line-height: 50px;
  font-size: 26px;
  font-weight: 60px;
}
</style>
