<template>
  <div>
    <nav-bar></nav-bar>
    <menu-left></menu-left>
  </div>
</template>

<script>
import MenuLeft from "components/common/MenuLeft"
import NavBar from "components/common/NavBar"

export default {
  data () {
    return {}
  },
  components: {
    "menu-left": MenuLeft,
    "nav-bar": NavBar
  }
}
</script>

<style>

</style>