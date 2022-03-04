<template>
<div id="regView" :style="{backgroundImage: `url(${require('img/login/bg'+roll+'.jpg')})`}">
  <div id='regForm'>
    <div id="logo"></div>
    <form class="row g-3">
      <!-- 用户名, 密码，确认密码，邮箱 -->
      <div  v-for="(v, i) in regInfo" :key="v.id" class="col-12">
      <label :for="v.id" class="form-label">{{v.label}}</label>
      <input v-model="v.v" @blur="infoCheck(i)" @click="infoClick(i)"
      :class="{'is-valid': v.valid>0, 'is-invalid': !v.valid}"
      :type=v.type class="form-control" :id="v.id" :placeholder=v.place>
      <div class="invalid-feedback">
        {{v.feedback}}
      </div>
      </div>
      <!-- 验证码 -->
      <div class="col-md-6">
      <input v-model="vCode" 
      type="text" class="form-control" id="inputVCode" placeholder='请输入验证码' :disabled="!allOk">
      </div>

      <div class="col-md-5">
      <button @click="vCodeBtnClick" :class="{cup: !(allOk&&sendOk)}"
      type='button' class="btn btn-outline-secondary" id="getVCode" :disabled="!(allOk&&sendOk)">{{vCodeHint}}</button>
      </div>
      
      <div class="col-12">
      <button @click="submitClick" :class="{cup: allOk}" key="submitBtn"
      type="button" class="btn btn-primary" id='regBtn' :disabled="!allOk">注册</button>
      </div>
      </form>
  </div>
</div>

</template>

<script>
import throttle from "utils/throttle"

export default {
  data () {
    return {
      regInfo: [
        {id:"inputUsername",  key:"name", label:"用户名", type:"text", place:"6-16个字符, 可使用数字、字母、下划线", feedback:"该用户名不合法", v:"", valid:-1},
        {id:"inputPassword",  key:"pwd", label:"登录密码", type:"password", place:"8-16个字符, 区分大小写", feedback:"该密码不合法", v:"", valid:-1},
        {id:"inputPassword2", key:"pwd", label:"确认密码", type:"password", place:"", feedback:"请确保与登录密码相同", v:"", valid:-1},
        {id:"inputEmail",     key:"mail", label:"邮箱", type:"email", place:"name@example.com", feedback:"该邮箱不合法", v:"", valid:-1},
      ],
      regs: [
        /^([A-Za-z0-9]|_){6,16}$/,
        /^([A-Za-z0-9]){8,16}$/,
        /^([A-Za-z0-9]){8,16}$/,
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      ],
      vCode:"",
      vCodeHint: "获取验证码",
      sendOk: 1,
      roll: 1
    }
  },
  methods: {
    infoClick (i) {
      this.regInfo[i].valid = -1
    },
    infoCheck (i) {
      let reg = this.regs[i]
      if (reg.test(this.regInfo[i].v)) {
        ;(async ()=>{
          try {
            // 用户名，邮箱查重检测
            if (i===0 || i===3) {
              let rsv = await this.rCheck(this.regInfo[i].key, this.regInfo[i].v)
              if (rsv) this.regInfo[i].valid = 1
              else this.regInfo[i].valid = 0
            } else if (i===2) {
              if (this.regInfo[1].v === this.regInfo[2].v) this.regInfo[i].valid = 1
              else this.regInfo[i].valid = 0
            } else this.regInfo[i].valid = 1
          } catch (e) {console.log(e)}
        })()
      } else this.regInfo[i].valid = 0
    },
    rCheck (key,val) {
      return new Promise ((rsv, rej) => {
        fetch(`/api/reg/checkVal?key=${key}&val=${val}`)
        .then(res => res.json()
        .then(data => {
          if (!data.err) rsv(1)
          else {
            console.log(data.msg)
            alert(data.msg[key] || data.msg)
            rsv(0)
          }
        })) 
      }) 
    },
    vCodeBtnClick: (() => {
      let flag = 1
      return function () {
        let t = 30
        if (flag) {
          flag = 0
          this.sendOk = 0
          this.vCodeHint = `${t}秒后可重新获取`
          this.rVCode (this.regInfo[3].v)
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
    submitClick: throttle(function(){
      this.rRegNew()
    },1000),
    rRegNew () {
      fetch(`/api/reg/regSubmit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          name: this.regInfo[0].v,
          pwd: this.regInfo[1].v,
          mail: this.regInfo[3].v,
          vcode: this.vCode
        })    
      })
      .then(res => res.json()
      .then(data => {
        if(!data.err) {
          setTimeout(() => {
            this.$router.push("/login")
          }, 3000)
        } else this.vCode = ""
        alert(data.msg)
      }))      
    }
  },
  computed: {
    allOk: function () {
      let count = 0
      this.regInfo.forEach(e => {
        if (e.valid===1) count++
      });
      if (count === 4) return true
      else return false
    }
  },
  created () {
    this.roll = Math.floor(Math.random()*10)
  }
}
</script>

<style scoped>
.cup {
  cursor: pointer;
}
#regView {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("~img/login/bg2.jpg") center/cover no-repeat;
}
#regForm {
  width: 600px;
  padding: 50px;
  border: 2px solid rgba(110, 168, 254, 0.2);
  border-radius: 10px;
  position: relative;
  background-color: #fff;
  box-shadow: 1px 1px 1px 1px ghostwhite;
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
#regForm>form {
  margin: 0 auto;
  width: 500px;
}
</style>