<template>
  <div>
    Demo3
    {{ routeName }}
    <button type="button" @click="back">返回</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Demo3",
  computed: {
    ...mapState({
      routeName: state => state.routeName
    })
  },
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>
