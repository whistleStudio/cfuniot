module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "views": "@/views",
        "img": "@/assets/img",
        "components": "@/components"
      }
    }
  }
}