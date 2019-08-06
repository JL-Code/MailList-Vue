<template>
  <el-dialog
    title="用户登录"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <el-button @click="handleClose">登录</el-button>
  </el-dialog>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      visible: true
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.$emit("close", "hi");
    }
  }
};
</script>

<style></style>
