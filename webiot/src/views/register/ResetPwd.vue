<!-- resetPwd -->
<template>
  <div id="resetPwd" >
    <reset-pwd-1 v-if="step==1" @nextStep="nextStep"/>
    <reset-pwd-2 v-else :myMail="myMail"/>
  </div>
</template>

<script>
  const ResetPwd1 = () => import("views/register/ResetPwd1")
  const ResetPwd2 = () => import("views/register/ResetPwd2")

  export default {
    data () {
      return {
        step: 1,
        myMail: ""
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
  background: url("~img/login/bg2.jpg") center/cover no-repeat;
}

</style>