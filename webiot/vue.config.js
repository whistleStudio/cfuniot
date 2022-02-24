const TerserPlugin = require("terser-webpack-plugin")
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "views": "@/views",
        "img": "@/assets/img",
        "components": "@/components",
        "utils": "@/utils"
      }
    },
    devServer: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8082",
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            "^/api": ""
          }
        }
      }
    },
    // optimization: {
    //   minimize: true,
    //   minimizer: [
    //     new TerserPlugin({
    //       terserOptions: {
    //         compress: {
    //           pure_funcs: ["console.log"]
    //         }
    //       }
    //     })
    //   ]  
    // }
    // optimization: {
    //   minimize: true,
    //   minimizer: [
    //     new TerserPlugin({
    //       terserOptions: {
    //         compress: {
    //           drop_console: true, // 默认false，设置为true, 则会删除所有console.* 相关的代码。
    //           pure_funcs: ["console.log"], // 单纯禁用console.log
    //         }
    //       }
    //     })
    //   ]
    // }
  }
}