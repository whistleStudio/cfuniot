<!-- set new pwd  -->
<template>
  <div id="resetPwdBox2">
    <div class="mb-3" style="margin-top: 20px">
      <div  v-for="(v, i) in newPwd" :key="v.id" class="col-12" style="margin-top: 20px">
      <label :for="v.id" class="form-label">{{v.label}}</label>
      <input v-model="v.v" @blur="pwdCheck(i)" @click="pwdClick(i)"
      :class="{'is-valid': v.valid>0, 'is-invalid': !v.valid}"
      :type=v.type class="form-control" :id="v.id" :placeholder=v.place>
      <div class="invalid-feedback">
        {{v.feedback}}
      </div>
      </div>
      <button :disabled="!newPwdOk" @click="newPwdSubmit"
      id='submitNewPwd' class="btn btn-secondary" >提交修改</button>      
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        newPwd: [
          {id:"inputPassword",  key:"pwd", label:"新密码", type:"password", place:"8-16个字符, 区分大小写", feedback:"该密码不合法", v:"", valid:-1},
          {id:"inputPassword2", key:"pwd", label:"确认密码", type:"password", place:"", feedback:"请确保与登录密码相同", v:"", valid:-1},
        ],
      };
    },
    computed: {
      newPwdOk: function () {
        return this.newPwd[0].valid && this.newPwd[1].valid
      }
    },
    props: {
      myMail: String
    },
    methods: {
      pwdClick (i) {
        this.newPwd[i].valid = -1
      },
      pwdCheck (i) {
        let reg = /^([A-Za-z0-9]){8,16}$/
        if (reg.test(this.newPwd[i].v)) {
          if (i) {
            if (this.newPwd[0].v === this.newPwd[1].v) this.newPwd[i].valid = 1
            else this.newPwd[i].valid = 0
          } else this.newPwd[i].valid = 1
        } else this.newPwd[i].valid = 0
      },
      newPwdSubmit () {
        try {
          fetch(`/api/reg/changePassword`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
              mail: this.myMail,
              pwd: this.newPwd[0].v,
            })           
          })
          .then(res => res.json()
          .then(data => {
            alert(data.msg)
            if (!data.err) 
            {
              sessionStorage.removeItem("token")
              this.$router.push("/login")
            }
          }))
        } catch (e) {console.log(e)}
      },
    },
  }
</script>

<style scoped>
  #resetPwdBox2 {
    width: 550px;
    height: 400px;
    border: 1px solid gainsboro;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #resetPwdBox2>div {
    width: 450px;
    height: 300px;
  }
  #submitNewPwd {
    margin: 50px auto;
    display: block;
    width: 450px;
  }
</style>