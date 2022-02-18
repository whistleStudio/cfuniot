<template>
<div id="userPage">
  <div>
    <p-menu-nav/>
  </div>
 
  <div>
     <!-- <button @click="$store.state.curAvatar++">clll</button> -->
    <router-view/>
  </div>
</div>
</template>

<script>
import PMenuNav from "components/private/PMenuNav"

export default {
  data () {
    return {
      
    }
  },
  components: {
    "p-menu-nav": PMenuNav
  },
  methods: {
    rGetUserInfo () {
      fetch("/api/user/getUserInfo")
      .then(res => res.json()
      .then(data => {
        // console.log(data)
        this.$store.commit("changeVal", {k:"curName", v:data.name})
        this.$store.commit("changeVal", {k:"curMail", v:data.mail})
        this.$store.commit("changeVal", {k:"curAvatar", v:data.avatar})
        this.$store.commit("changeVal", {k:"curAuth", v:data.authority})
        this.$store.commit("changeVal", {k:"curAuthDate", v:data.authDate})
      }))
    },
    rGetDevInfoReset () {
      fetch(`/api/dev/getDevlist`)
      .then(res => res.json()
      .then(data => {
        this.$store.commit("changeVal", {k:"curDevs", v:data.data})
        this.$store.commit("resetDevState")
      }))
    }
  },
  created () {
    this.rGetUserInfo()
    this.rGetDevInfoReset()
    console.log('user created')
    /* 子页面刷新回到父级页面 */
    // if (this.$route.path.match(/\/user\/.+/)) {
    //   this.$router.push("/user")
    // }
    // window.onbeforeunload= e => {
    //   return "关闭提示"
    // }
  },

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