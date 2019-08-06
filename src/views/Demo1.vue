<template>
  <div>
    Demo1
    {{ routeName }}
    <button type="button" @click="back">返回</button>
    <button type="button" @click="updateRouteName">更新routeName</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Demo1",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      routeName: state => state.routeName
    })
  },
  methods: {
    back() {
      this.$router.back();
    },
    updateRouteName() {
      this.$store.commit("updateRouteName", "demo1");
    }
  }
};
</script>
