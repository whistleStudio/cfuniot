<!-- resetPwd -->
<template>
  <div id="resetPwd" :style="{backgroundImage: `url(${bgUrls[roll]})`}">
    <reset-pwd-1 v-if="step==1" @nextStep="nextStep"/>
    <reset-pwd-2 v-else :myMail="myMail"/>
  </div>
</template>

<script>
  const ResetPwd1 = () => import("views/register/ResetPwd1")
  const ResetPwd2 = () => import("views/register/ResetPwd2")
  import {bgUrls} from "../login/bgData.json"

  export default {
    data () {
      return {
        step: 1,
        myMail: "",
        roll: 1,
        bgUrls
      };
    },
    components: {
      "reset-pwd-1": ResetPwd1,
      "reset-pwd-2": ResetPwd2,
    },
    methods: {
      nextStep({step, mail}) {
        this.step = step
        this.myMail = mail
      }
    },
    created () {
      this.roll = Math.floor(Math.random()*10)
    }
  }
</script>

<style scoped>
#resetPwd {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: #000;   */
  background:  center/cover no-repeat;
}

</style>