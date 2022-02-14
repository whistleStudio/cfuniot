<template>
<div id="userPage">
  <div>
    <p-menu-nav></p-menu-nav>
  </div>
  <div>
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
#userPage>div:first-of-type {
  z-index: 2;
}
#userPage>div:last-of-type {
  padding-top: 80px;
  padding-left: 200px;
}
</style>