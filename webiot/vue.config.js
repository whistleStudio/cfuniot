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
    }
  }
}