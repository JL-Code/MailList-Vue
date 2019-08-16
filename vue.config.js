const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  // baseUrl 3.4版本已废弃  refs:https://cli.vuejs.org/zh/config/#baseurl
  // publicPath 等价于 webpack 的 output.publicPath
  publicPath: isProduction ? "./areas/app/content/ppm/" : "/",
  devServer: {
    disableHostCheck: true, // 禁用主机检查
    proxy: {
      "/api": {
        target: process.env.VUE_APP_SERVER,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  }
};
