<template>
  <div>
    <div id="navbar">
      <div>{{reqLoc.prov}}  {{reqLoc.city}}</div>
      <div>
      <span>{{curName}}</span>
      <div id="profile" :style="{backgroundImage: `url(${require('img/user/av'+curAvatar+'.jpg')})`}" 
      data-bs-toggle="modal" data-bs-target="#profileModal" @click="newNameInfo.sta=-1"></div>
      </div>
    </div>
    <!-- modal profile -->
    <div class="modal fade" id="profileModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="profileModalLabe" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">我的信息</h5> <span @click="logoutClick" id="logout">[退出登录]</span>
          <button ref="closeModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                    <input type="text" id="ipUsername" class="form-control" aria-describedby="passwordHelpInline" 
                    :value="curName" :class="{'is-valid': newNameInfo.sta==0, 'is-invalid': newNameInfo.sta>0}" @blur="changeName">
                    <div class="invalid-feedback" v-show="newNameInfo.sta>0">
                      {{newNameInfo.hint[newNameInfo.sta]}}
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
                    <button id="btnLvl" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#lvlModal">激活码升级</button>
                  </div>
                  <div class="offset-3">
                    <span id='invalidDate' v-show="$store.state.curAuth>1">失效时间: {{curAuthDate}}</span>
                  </div>         
                </div>
                <!-- 账号安全 -->
                <div class="row mgb-20" id="pwdReset">
                  <div class="col-3">
                    <label  class="col-form-label">账号安全</label>
                  </div>
                  <div class="col-9">
                    <button v-if="$store.state.curRole" @click="resetPwd" type="button" class="btn btn-danger">修改密码</button>
                    <span v-else class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" title="无修改权限, 请联系父级用户">
                      <button class="btn btn-secondary" type="button" disabled>修改密码</button>
                    </span>
                  </div>  
                </div>
                <div class="row mgb-20" id="setLoc">
                  <div class="col-3">
                    <label  class="col-form-label">所在地</label>
                  </div>
                  <div class="col-4">
                    <select v-model="actLoc.prov" @change="actLoc.city=0"
                    class="form-select form-select" aria-label=".form-select-sm example">
                    <option disabled value="-1">请选择省份</option>
                    <option v-for="(v, i) in locInfo" :key="i" :value="i">{{v.name}}</option>
                    </select> 
                  </div>
                  <div class="col-4">
                    <select :disabled="!(actLoc.prov>=0)" v-model="actLoc.city"
                    class="form-select form-select" aria-label=".form-select-sm example">
                    <option disabled value="-1">请选择市/区</option>
                    <option v-for="(v,i) in optCities" :key="i" :value="i">{{v}}</option>
                    </select>  
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- modal avatar -->
    <div class="modal" id='avatarModal' tabindex="-1">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">选择一个你喜欢的头像吧</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="avatarWrap">
          <div v-for="(v, i) in Array(25)" :key="i" @click="changeAvatar(i)" class="item" 
          :style="{backgroundImage: `url(${require('img/user/av'+i+'.jpg')})`}"></div>
        </div>
      </div>
      </div>
      </div>
    </div>
    <!-- modal uplvl -->
    <div class="modal" id='lvlModal' tabindex="-1"  data-bs-backdrop="static">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
      <!-- <h5 class="modal-title">升级权限</h5> -->
      <button type="button" class="btn-close" id="clsLvlModal" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body" style="height: 100px; padding-top: 30px;">
      <input v-model="actCode" class="form-control" type="text" placeholder="请输入激活码" aria-label="default input example">
    </div>
    <div class="modal-footer">
      <button id="cLvlModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
      <button id="actLvl"  @click="rUpLvl" type="button" class="btn btn-primary">激活</button>
    </div>
    </div>
    </div>
    </div>          
  </div>
</template>

<script>
import {info as locInfo} from "../private/city.json"

export default {
  data () {
    return {
      newNameInfo: {
        sta: -1, 
        hint: ["","该用户名已经被使用了, 请更换", "该用户名不合法; 6-16个字符, 可使用数字、字母、下划线"]
      },
      actCode: "",
      locInfo,
      actLoc: {
        prov: -1,
        city: -1
      },
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
    },
    curAuthDate: function () {
      let ivD = new Date(this.$store.state.curAuthDate)
      return `${ivD.getFullYear()}-${ivD.getMonth()+1}-${ivD.getDate()}`
    },
    optCities: function () {
      return this.actLoc.prov>=0 ? this.locInfo[this.actLoc.prov].city : []
    },
    reqLoc: function () {
      let o = {}, prov="", city=""
      if (this.actLoc.prov>=0) {
        prov = this.locInfo[this.actLoc.prov].name
        city = this.locInfo[this.actLoc.prov].city[this.actLoc.city]
        let reg1 = /(.+)省/
        if (reg1.test(prov)) {
          prov = prov.match(reg1)[1]
        } else {
          prov = prov.slice(0,2)
        }
        let reg2 = /(.+)(市|县|盟|镇|区|州|地区)/
        let reg3 = /新区/
        if (city.length > 2) {
          if (reg2.test(city)&&!reg3.test(city)){
            city = city.match(reg2)[1]
          }
        }
      }
      o = {prov, city}
      return o
    }
  },
  methods: {
    // 更换头像
    changeAvatar (i) {
      this.$store.commit("changeVal", {k:"curAvatar", v:i})
      this.rReqAvatar(i)
      document.querySelector('#avatarModal button').click()
    },
    rReqAvatar (i) {
      fetch(`/api/user/reqAvatar?avatar=${i}`)
      .then(res => res.json()
      .then(data => {console.log('reqAvatar---', data)}))      
    },
    // 更换昵称
    changeName () {
      let reg = /^([A-Za-z0-9]|_){6,16}$/
      let ipN = document.querySelector('#ipUsername')
      let newName = ipN.value
      console.log(newName)
      if (newName !== this.$store.state.curName) {
        if (reg.test(newName)) {
          fetch(`/api/user/changeName?name=${newName}`)
          .then(res => res.json()
          .then(data => {
            if (!data.err) {
              this.newNameInfo.sta = 0
              this.$store.commit("changeVal", {k: "curName", v: newName})
            }else {
              this.newNameInfo.sta = 1
              // 全是空格
              // database error 没写
            }
          }))
        }else {
          this.newNameInfo.sta = 2
        }
      } else this.newNameInfo.sta = -1
    },
    // 权限升级
    rUpLvl () {
      fetch(`/api/user/actLvl?code=${this.actCode}`)
      .then(res => res.json()
      .then(data => {
        if (!data.err) {
          this.$store.commit("changeVal", {k:"curAuth", v:data.auth})
          this.$store.commit("changeVal", {k:"curAuthDate", v:data.authDate})
        }
        this.actCode = ''
        alert(data.msg)
      }))      
    },
    // 修改密码 (待补充)
    resetPwd () {
      this.$refs.closeModal.click()
      this.$router.push("/resetPwd")
    },
    // 退出登录
    logoutClick () {
      this.$refs.closeModal.click()
      setTimeout(()=>{this.$router.push("/login")}, 200)  
    }  
  },
  mounted () {
    console.log(this.locInfo)
    console.log(this.actLoc.prov>=0)
  }
}
</script>

<style scoped>
  .mgb-20 {
    margin-bottom: 20px;
  }
  #navbar {
    position: fixed;
    height: 80px;
    width: 100%;
    box-shadow: 0 1px 1px gainsboro;
    background-color: white;
    z-index: 1;
  }
  #navbar>div:first-of-type {
    float: left;
    height: 80px;
    margin-left: 280px;
    font: 20px/80px sans-serif;
  }
  #navbar>div:last-of-type {
    height: 80px;
    float: right;
    margin-right: 50px;
    display: flex;
    align-items: center;
  }
  #navbar>div:last-of-type>span {
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
    /* background-color: orange;  */
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
  #logout {
    margin-left: 1rem;
    cursor: pointer;
  }
  #logout:hover {
    color: var(--rCfColor);
  }  
</style>