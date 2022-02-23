<!-- resetPwd -->
<template>
  <div id="resetPwd">
    <div v-if="step==1" id="resetPwdBox">
    <div>
      <div class="mb-3" style="margin-top: 20px">
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
            <input :disabled="!(mail.valid==1)" v-model="vCode" @input="isNextOk"
            type="text" class="form-control" id="vCode" placeholder="">
          </div>
          <div class="col-5">
            <button :disabled="!(mail.valid==1&&sendOk)"
            id="sendVCode" class="btn btn-outline-secondary " style="float: right;">发送验证码</button>
          </div>    
        </div>        
      </div>
      <button :disabled="!nextOk" id='next' class="btn btn-secondary" >下一步</button>
    </div>
    </div>    
  </div>
</template>

<script>
  export default {
    data () {
      return {
        step: 1,
        mail: {v:"", valid:0},
        vCode: "",
        sendOk: 1,
        nextOk: 0
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
          // fetch(`/api/reg/sendMail?key=mail&val=${this.mail.v}`)
          // .then(res => res.json()
          // .then(data => {
          //   if (!data.err) this.mail.valid = 1
          //   else {
          //     alert(data.msg)
          //     this.mail.valid = 0
          //   }
          // })) 
        } else this.mail.valid = 0   
      },
      isNextOk () {
        if (this.mail.v&&this.mail.valid) this.nextOk = 1 
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
}
#resetPwdBox {
  width: 500px;
  height: 400px;
  border: 1px solid gainsboro;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#resetPwdBox>div {
  width: 400px;
  height: 300px;
}
#next {
  margin: 50px auto;
  display: block;
  width: 400px;
}
</style>