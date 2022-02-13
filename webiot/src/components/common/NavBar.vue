<template>
  <div>
    <div id="navbar">
    <div>
      <span>wsh</span>
      <div id="profile" data-bs-toggle="modal" data-bs-target="#profileModal"></div>
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
                  <div data-bs-toggle="modal" data-bs-target="#avatarModal"> <span>更换</span> </div>
                </div>
                <!-- 用户名 -->
                <div class="row mgb-20" id="username">
                  <div class="col-3">
                    <label for="ipUsername" class="col-form-label">用户名</label>
                  </div>
                  <div class="col-9">
                    <input type="text" id="ipUsername" class="form-control" aria-describedby="passwordHelpInline">
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
                    <input type="text" id="myMail" class="form-control" value='123@qq.com' disabled aria-describedby="passwordHelpInline" style="border: none;">
                  </div>
                </div>
                <!-- 账户级别 -->  
                <div class="row mgb-20" id="myLvl">
                  <div class="col-3">
                    <label for="inputPassword6" class="col-form-label">账户级别</label>
                  </div>
                  <div class="col-9">
                    <!-- <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"> -->
                    <img src="/public/pic/lvl.png" alt=""><span id='lvl'>管理员</span>
                    <button id="btnLvl" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#lvlModal">权限升级</button>
                  </div>
                  <div class="offset-3">
                    <span id='invalidDate'>失效时间：2022-2-22</span>
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
</style>