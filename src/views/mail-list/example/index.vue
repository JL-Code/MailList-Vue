<template>
  <div>
    <el-button type="button" @click="openMailList">点击选人</el-button>
  </div>
</template>

<script>
import dialogAsync from "../src/dialog-async";
import MailList from "../index";
export default {
  components: { MailList },
  methods: {
    openMailList() {
      dialogAsync(MailList, {
        title: "选择联系人",
        placeholder: "搜索姓名、用户代码",
        userId: "51d9cf3b-2312-e611-97bc-fa7d84a2e3a1",
        value: [
          {
            id: "68d5333d-f106-4a45-9a5b-61589da05ffd",
            name: "系统管理员"
          },
          {
            id: "32238b90-8d49-e811-810a-9089c5ea5ec1",
            name: "李小聪"
          },
          {
            id: "ac5a37e5-03c9-e711-8107-a4c858fd94e6",
            name: "肖彬"
          }
        ]
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