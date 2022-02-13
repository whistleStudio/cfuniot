<template>
<div id="userPage">
  <p-menu-nav></p-menu-nav>
  <div id="contentPage">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import PMenuNav from "components/private/PMenuNav"

export default {
  data () {
    return {}
  },
  components: {
    "p-menu-nav": PMenuNav
  }
}
</script>

<style scoped>
#contentPage {
  position: absolute;
  left: 200px;
  top: 80px;
}
</style>