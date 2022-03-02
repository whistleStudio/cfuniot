<!-- resetpwd vcode vertify -->
<template>
  <div id="resetPwdBox">
    <div id="logo"></div>
    <div>
      <div class="mb-3" style="margin-top: 20px" >
        <label for="mailReset" class="form-label">注册邮箱</label>
        <input v-model="mail.v" :class="{'is-valid': mail.valid==1, 'is-invalid': !mail.valid}" 
        @click="mailClick" @blur="mailCheck"
        type="email" class="form-control" id="mailReset" placeholder="name@example.com">
        <div id="showEmail" class="invalid-feedback">
          该邮箱不合法
        </div>
      </div>
      <div class="mb-3">
        <label for="vCode" class="form-label">验证码</label>
        <div class="row ">
          <div class="col-7">
            <input :disabled="!(mail.valid==1)" v-model="vCode" 
            type="text" class="form-control" id="vCode" placeholder="">
          </div>
          <div class="col-5">
            <button :disabled="!(mail.valid==1&&sendOk)" @click="vCodeBtnClick"
            id="sendVCode" class="btn btn-outline-secondary " style="float: right;">{{vCodeHint}}</button>
          </div>    
        </div>        
      </div>
      <button :disabled="!nextOk" @click="nextBtnClick"
      id='next' class="btn btn-secondary" >下一步</button>
    </div>
  </div>    
</template>

<script>
  import throttle from "utils/throttle"

  export default {
    data () {
      return {
        mail: {v:"", valid:-1},
        vCode: "",
        sendOk: 1,
        vCodeHint: "获取验证码",
      };
    },
    methods: {
      mailClick () {
        this.mail.valid = -1
      },
      mailCheck () {
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if (reg.test(this.mail.v)) {
           this.mail.valid = 1
        } else this.mail.valid = 0   
      },
      vCodeBtnClick: (() => {
      let flag = 1
      return function () {
        let t = 60
        if (flag) {
          flag = 0
          this.sendOk = 0
          this.vCodeHint = `${t}秒后可重新获取`
          this.rVCode (this.mail.v)
          let tim =setInterval(()=>{
            t --
            if (!t) {
              this.vCodeHint = "获取验证码"
              clearInterval(tim)
              flag = 1
              this.sendOk = 1
            } else this.vCodeHint = `${t}秒后可重新获取`
          }, 1000)
        }
      }
      })(),
      rVCode (mail) {
      fetch(`/api/reg/sendMail?mail=${mail}`)
      .then(res => res.json()
      .then(data => {
        if (data.err) {alert(data.msg)}
      }))      
      },
      nextBtnClick: throttle(function () {
        fetch(`/api/reg/checkVCode?mail=${this.mail.v}&vcode=${this.vCode}`)
        .then(res => res.json()
        .then(data => {
          console.log(data)
          if (!data.err) this.$emit('nextStep', {step: 2, mail: this.mail.v})
          else {
            this.vCode = ""
            alert(data.msg)
          }
        }))
      }, 500),   
    },
    computed: {
      nextOk: function () {
        return Boolean(this.vCode&&this.mail.valid)
      }
    },
  }
</script>

<style scoped>

#resetPwdBox {
  width: 550px;
  height: 400px;
  border: 2px solid rgba(110, 168, 254, 0.2);
  border-radius: 10px;
  position: relative;
  background-color: #fff;
  box-shadow: 1px 1px 1px 1px ghostwhite;
  display: flex;
  justify-content: center;
  align-items: center;
}
#resetPwdBox>div:last-of-type {
  width: 450px;
  height: 300px;
}
#next {
  margin: 50px auto;
  display: block;
  width: 450px;
}
#logo {
  width: 120px;
  height: calc(120px / 1.4);
  position: absolute;
  left: 50%;
  top: calc(-60px / 1.4);
  transform: translate(-50%);
  background: url("~img/login/cflogo.png") center/contain no-repeat;
  background-color: white;
}
</style>