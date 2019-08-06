<template>
  <div>
    Demo2
    {{ routeName }}
    <button type="button" @click="back">返回</button>
    <router-link :to="{ name: 'Demo3' }">Demo3</router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Demo2",
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
