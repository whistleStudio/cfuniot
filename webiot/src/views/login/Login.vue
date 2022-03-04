<template>
  <div :style="{backgroundImage: `url(${require('img/login/bg'+roll+'.jpg')})`}" id='rootLogin'>
    <div id="logbox">
      <div id="logshow">
        <div></div>
      </div>
      <div id='login'>
      <form >
        <div>
          <div id="logo"></div>
          <h1>创趣物联网平台</h1>
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">邮箱</label>
          <input  v-model="mail" placeholder="name@example.com"
          class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
          <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
        </div>
        <div class="mb-3" style="marginTop: 10px">
          <label for="pwd" class="form-label">密码</label>
          <span id="forgetPwd" @click="forgetClick">(忘记密码, 我要重置)</span>
          <input v-model="pwd" type="password" class="form-control" id="pwd">
        </div>
        <button @click.prevent="submit" id='logBtn' type="submit" class="btn btn-primary">登录</button>
        <a id='regBtn' @click="regClick"> 还没有账号? 点击这里完成注册</a>
      </form>
      </div>      
    </div>
    <div id="footer">备案号</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mail: "",
      pwd: "",
      roll: 1,
    }
  },
  methods: {
    submit () {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          mail: this.mail,
          pwd: this.pwd
        })
      })
      .then(res => res.json()
      .then(data => {
        if(!data.err) {
          const token = data.tkid
          sessionStorage.setItem("token", token)
          this.$router.push("/user")
        }else {
          sessionStorage.removeItem("token")
          alert(data.msg)}
      }))         
    },
    regClick () {
      this.$router.push("/register")
    },
    forgetClick () {
      this.$router.push("/resetPwd")
    },
  },
  created () {
    this.roll = Math.floor(Math.random()*10)
  }
}
</script>

<style scoped>
#rootLogin {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:  center/cover no-repeat;
}
#logbox {
  width: 900px;
  height: 500px;
  background-color: white;
  display: flex;
  border: 2px solid rgba(110, 168, 254, 0.2);
  border-radius: 15px;
  box-shadow: 1px 1px 1px 1px ghostwhite;
}
#logshow {
  width: 450px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#logshow>div {
  width: 80%;
  height: 80%;
  background: url("~img/login/iotCartoon.png") center/contain no-repeat;
}
#login {
  width: 450px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#login>form {
  width: 350px;
  /* height: 350px; */
}
#logo {
  margin:0 auto;
  width: 90px;
  height: calc((100px / 1.4));
  background: url("~img/login/cflogo.png") center/contain no-repeat;
}
#login>form h1 {
  text-align: center;
  font: 1.5rem "Microsoft Yahei";
  color: rgb(90,90,90);
}
#regBtn {
  display: block;
  /* text-decoration: none; */
  margin-top: 20px;
  cursor: pointer;
  color: rgb(122, 122, 122);
}
#logBtn {
  margin-top: 30px;
  width: 350px;
}
#footer {
  position: fixed;
  bottom: 20px;
}

#forgetPwd {
  float: right;
  color: rgb(122, 122, 122);
  cursor: pointer;
}

#regBtn:hover, #forgetPwd:hover {
  color: rgb(110, 168, 254)
}
</style>