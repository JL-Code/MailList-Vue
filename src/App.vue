<template>
  <div id="app" ref="app">
    <router-view />
    <!-- <login @close="close"></login> -->
    <!-- <el-dialog
      title="用户登录"
      append-to-body
      :visible.sync="visible"
      :before-close="handleClose"
    >
    </el-dialog>
    <el-button @click="visible=true">dialog</el-button>-->
    <!-- 动态dialog s -->
    <!-- <component
      :is="dialogTemplate"
      v-if="dialogTemplate"
    ></component>-->
    <!-- 动态dialog e -->
    <!-- <el-button @click="openDialog1">打开Dialog1</el-button>
    <el-button @click="openDialog2">打开Dialog2</el-button>
    <el-button @click="openDialog3">打开Dialog3</el-button>
    <el-button @click="openDialog4">打开Dialog4</el-button>-->
  </div>
</template>
<script>
  import login from "./views/login";
  import detail from "./views/detail";
  import detail2 from "./views/detail2";
  import dialogAsync from "./components/dialog-async";
  export default {
    name: "App",
    components: { login },
    data() {
      return {
        visible: false,
        dialogTemplate: undefined
      };
    },
    methods: {
      handleClose(done) {
        done();
      },
      close(data) {
        console.log(data);
      },
      openDialog1() {
        dialogAsync(detail, {}, template => {
          this.dialogTemplate = template;
        })
          .then(res => {
            this.dialogTemplate = null;
          })
          .catch(err => {
            this.dialogTemplate = null;
            console.log(err);
          });
      },
      openDialog2() {
        dialogAsync(detail2, {}, template => {
          this.dialogTemplate = template;
        })
          .then(res => {
            this.dialogTemplate = null;
          })
          .catch(err => {
            this.dialogTemplate = null;
            console.log(err);
          });
      },
      openDialog3() {
        this.$dialog(detail, {})
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      },
      openDialog4() {
        this.$dialog(detail2, { el: this.$refs.app, appendToBody: false })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>

<style lang="less">
  html,
  body {
    margin: 0;
    padding: 0;
  }

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