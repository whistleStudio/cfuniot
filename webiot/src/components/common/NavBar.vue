<template>
  <div>
    <div id="navbar">
    <div>
      <span>{{curName}}</span>
      <div id="profile" :style="{backgroundImage: `url(${require('img/user/av'+curAvatar+'.jpg')})`}" 
      data-bs-toggle="modal" data-bs-target="#profileModal"></div>
    </div>
    </div>
    <!-- modal profile -->
    <div class="modal fade" id="profileModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="profileModalLabe" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">我的信息</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="card" style="border: none;">
            <div class="card-body">              
              <form class="row g-3">                  
                <div id="avatar" class="row mgb-20">
                  <div class="col-3">
                    <label for="inputPassword6" class="col-form-label">头像</label>
                  </div>
                  <div :style="{backgroundImage: `url(${require('img/user/av'+curAvatar+'.jpg')})`}" 
                  data-bs-toggle="modal" data-bs-target="#avatarModal"> <span>更换</span> 
                  </div>
                </div>
                <!-- 用户名 -->
                <div class="row mgb-20" id="username">
                  <div class="col-3">
                    <label for="ipUsername" class="col-form-label">用户名</label>
                  </div>
                  <div class="col-9">
                    <input type="text" id="ipUsername" class="form-control" aria-describedby="passwordHelpInline" :value="curName">
                    <div class="invalid-feedback">
                      Looks bad!
                    </div>
                  </div>
                </div>
                <!-- 邮箱 -->  
                <div class="row mgb-20" id="mail">
                  <div class="col-3">
                    <label for="myMail" class="col-form-label">邮箱</label>
                  </div>
                  <div class="col-9">
                    <input type="text" id="myMail" class="form-control" :value="curMail" disabled aria-describedby="passwordHelpInline" style="border: none;">
                  </div>
                </div>
                <!-- 账户级别 -->  
                <div class="row mgb-20" id="myLvl">
                  <div class="col-3">
                    <label for="inputPassword6" class="col-form-label">账户级别</label>
                  </div>
                  <div class="col-9">
                    <!-- <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"> -->
                    <img :src="require('img/user/lvl.png')" alt=""><span id='lvl'>LV{{curAuth}}</span>
                    <button id="btnLvl" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#lvlModal">权限升级</button>
                  </div>
                  <div class="offset-3">
                    <span id='invalidDate'>失效时间: 2022-2-22</span>
                  </div>         
                </div>
                <!-- 账号安全 -->
                <div class="row" id="pwdReset">
                  <div class="col-3">
                    <label  class="col-form-label">账号安全</label>
                  </div>
                  <div class="col-9">
                    <button type="button" class="btn btn-danger">修改密码</button>
                  </div>  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>      
  </div>
</template>

<script>
// import  "bootstrap/dist/js/bootstrap.bundle.min.js"
export default {
  data () {
    return {
    }
  },
  computed: {
    curAvatar: function () {
      return this.$store.state.curAvatar
    },
    curName: function () {
      return this.$store.state.curName
    },
    curMail: function () {
      return this.$store.state.curMail
    },
    curAuth: function () {
      return this.$store.state.curAuth
    }
  },
}
</script>

<style scoped>
  #navbar {
    position: fixed;
    height: 80px;
    width: 100%;
    box-shadow: 0 1px 1px gainsboro;
    background-color: white;
    /* z-index: 9; */
  }
  #navbar>div:first-of-type {
    height: 80px;
    float: right;
    margin-right: 50px;
    display: flex;
    align-items: center;
  }
  #navbar>div>span {
    display: inline-block;
    height: 80px;
    font: 20px/80px sans-serif;
    cursor: pointer;
  }
  #profile {
    display: inline-block;
    width: 60px;
    height: 60px;
    border: 1px solid gainsboro;
    border-radius: 8px;
    background: center/contain no-repeat;
    margin-left: 10px;
    background-color: orange; 
    cursor: pointer;  
  }

  #profile>span:last-child {
    display: inline-block;
    margin-left: 10px;
    width: 60px;
    height: 60px;
    border: 1px solid gainsboro;
    border-radius: 8px;
    background: center/contain no-repeat;
  }
  #avatar {
    width: 100%;
    /* background-color: orange; */
    display: flex;
    align-items: center;
  }
  #avatar label {
    line-height: 150px;
  }
  #avatar>div:last-of-type {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px solid gainsboro;
    /* background-color: pink; */
    background: center/contain no-repeat;
    cursor: pointer;
    background-blend-mode: normal;
  }
  #avatar>div:last-of-type>span {
    text-align: center;
    display: block;
    width: 100%;
    font: bold 17px/130px sans-serif;
    opacity: 0;
  }

  #profileModal .modal-content {
    width: 600px;
    height: 600px;
    background-color: white;
    border-radius: 10px;
  }

  #profileModal .card-body {
    width: 100%;
    /* height: 600px; */
    /* background-color: olive; */
  }
  #myLvl img {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }
  #lvl {
    font-weight: bold;
    color: rgb(202, 163, 110);
    margin-right: 2rem;
  }
  #avatarModal .modal-content {
    width: 840px;
    height: 800px;
    background-color: white;
    border-radius: 10px;
    overflow: scroll;
  }
  #avatarWrap {
    width: 800px;
    height: 800px;
    display: grid;
    grid-template-columns: repeat(5, 150px);
    gap:5px 5px;
  }
  #avatarWrap>.item {
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid rgb(148, 148, 148);
    background: center/cover no-repeat;
    cursor: pointer;
    opacity: 0.85;
    /* background-size: contain; */
  }
  /* #lvlModal {
    width: 600px;
    height: 400px;
    margin-top: 100px;
  } */




  #main-content {
    margin-top: 80px;
    /* position: absolute;
    left: 200px; */
  }


  #avatar>div:last-of-type:hover {
    background-blend-mode: multiply;
  }

  #avatar>div:last-of-type>span:hover {
    display: block;
    opacity: 0.7;
  }
  #avatarWrap>.item:hover {
    box-shadow: 3px 3px 3px gray;
    opacity: 1;
  }  
</style>