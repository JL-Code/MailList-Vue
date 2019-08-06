<template>
  <div id="app">
    <!-- <router-view /> -->
    <!-- <login @close="close"></login> -->
  </div>
</template>
<script>
import login from "./views/login";
import componentAsync from "./components/component-async";
export default {
  components: { login },
  methods: {
    close (data) {
      console.log(data);
    }
  },
  async mounted () {
    let data = await componentAsync(login);
    console.log("async mounted：", data);
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
