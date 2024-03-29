const { defineConfig } = require('@vue/cli-service');
const API_ADDRESS = "http://192.168.3.3:8080";
// const API_ADDRESS = "http://192.168.3.4:8080";
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,//关闭语法检查
  devServer: {
    open: false, //浏览器自动打开页面
    port: 8000,//真机测试端口
    https: false,
    proxy: {
      '/api': {
        target: API_ADDRESS + "/",  //需要访问的地址
        ws: true,
        changOrigin: true, //是否跨域
        // secure: false, //是否https接口
        pathRewrite: {
          '^/api': ''
        }
      },
      // '/captcha': {
      //   target: "http://127.0.0.1:9001/moyujun/uc",  //需要访问的地址
      //   ws: true,
      //   changOrigin: true, //是否跨域
      //   secure: true, //是否https接口
      //   // rewrite: (path) => path.replace(/^\/api/, ''),
      // },
      
    },
  },
})
