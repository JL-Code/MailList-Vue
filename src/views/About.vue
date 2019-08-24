<template>
  <div>
    <el-button type="button" @click="openMailList">点击选人</el-button>
  </div>
</template>

<script>
import dialogAsync from "./mail-list/src/dialog-async";
import MailList from "./mail-list";
export default {
  components: { MailList },
  methods: {
    openMailList() {
      dialogAsync(MailList, {
        title: "选择联系人",
        placeholder: "搜索姓名、用户代码"
      })
        .then(res => {
          console.log("res", res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleConfrim(data) {
      console.log("confirm", data);
    }
  }
};
</script>