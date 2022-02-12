<template>
  <div id='rootLogin'>
    <div id='login'>
      <form >
      <!-- <form action="./user" method='get'> -->
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input  v-model="mail" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input v-model="pwd" type="password" class="form-control" id="pwd">
        </div>
        <!-- <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div> -->
        <button @click.prevent="submit" id='logBtn' type="submit" class="btn btn-primary">登录</button>
        <a href="http://localhost:8082/reg" id='regBtn'> 还没有用户? 点击这里注册</a>
      </form>
    </div>
    <div id="footer">备案号</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mail: "",
      pwd: ""
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
          // const state = { 'us': data.tk }
          // const title = ''
          // const url = `/user` 
          // history.pushState(state, title, url)
          this.$router.push("/user")
        }else alert(data.msg)
      }))         
    }
  }
}
</script>

<style>
#rootLogin {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#login {
  width: 450px;
  height: 400px;
  border: 2px solid rgba(110, 168, 254, 0.5);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#login>form {
  width: 400px;
  height: 300px;
}

#regBtn {
  display: block;
  /* text-decoration: none; */
  margin-top: 20px;
  cursor: pointer;
  color: rgb(122, 122, 122);
}
#regBtn:hover {
  color: rgb(110, 168, 254)
}

#footer {
  position: fixed;
  bottom: 20px;
}
</style>