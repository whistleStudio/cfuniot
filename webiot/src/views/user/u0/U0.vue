/* device */
<template>
  <div id="u0">
    <div id='main-content-sum' style="margin-left: 80px; padding-right: 100px;">
    <div>概览</div>
    <ul>
      <!-- <li><img src="/public/pic/iconInfo0.png" alt=""><span>设备总量</span><span id='ownDev'>n</span></li>
      <li><img src="/public/pic/iconInfo1.png" alt=""><span>在线设备</span><span id='olineDev'>n</span></li>
      <li data-bs-toggle="modal" data-bs-target="#codeModal"><img src="/public/pic/iconInfo2.png" alt=""><span>连接密钥</span><span></span></li>
      <li data-bs-toggle="modal" data-bs-target="#devModal"><img src="/public/pic/iconInfo3.png" alt=""><span>管理设备</span><span></span></li> -->
      <li v-for="(v,i) in dev" :key="i" :data-bs-toggle="v.toggle" :data-bs-target="v.target">
        <img :src="require(`img/u0/iconInfo0.png`)" alt="">
        <span>{{v.name}}</span>
        <span></span>
      </li>
    </ul>
    </div>
    <div id='main-content-detail' style="margin-left: 80px;">
    <div id='refreshDevBtn'>[状态刷新]</div>
    <div>
      <table class="table table-hover">
        <thead>
        <tr>
        <th scope="col">名称</th>
        <th scope="col">id</th>
        <th scope="col">状态</th>
        <!-- <th scope="col">激活</th> -->
        </tr>
        </thead>
        <tbody id='showDev'>
        <!-- <tr>
        <th scope="row">灯</th>
        <td>sdsajkhd11</td>
        <td>在线</td>
        <td>yes</td>
        </tr> -->
        
        </tbody>
        </table>
    </div>
    </div>
    
    <!-- dev manage Modal -->
    <div class="modal fade" id="devModal" tabindex="-1" aria-labelledby="devModalLabel" aria-hidden="true" data-bs-backdrop="static"> 
  <div class="modal-dialog">
  <div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title" id="devModalLabel">设备管理</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
    <div>
      <span>名称</span><span>ID</span>
    </div>
    <ul>
      <!-- <li class="devListModal"> <span>飞机</span><span>12312312312</span><span>删除</span> </li> -->
    </ul>
  </div>
  <div class="modal-footer">
    <input type="text" class="form-control" id="devInput1" placeholder="输入设备名称">
    <input type="text" class="form-control" id="devInput2" placeholder="输入设备ID(1-255)">
    <button type="button" class="btn btn-primary" id='regDevBtn' >新增设备</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">返回</button>
  </div>
  </div>
  </div>
    </div>
  
    <!-- code Modal -->
    <div class="modal fade" id="codeModal" tabindex="-1" aria-labelledby="codeModalLabel" aria-hidden="true">
  <div class="modal-dialog">
  <div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title" id="codeModalLabel">我的密钥</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body" id="codeInfo">
    <!-- <div  class="invalid-feedback">
      该主题不合法
    </div> -->
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" id='genCodeBtn'>生成</button>
    <button type="button" class="btn btn-primary" id='confirmCode' data-bs-dismiss="modal">确定</button>
  </div>
  </div>
  </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dev: [
        {name: "设备总量", img: "iconInfo0.png", toggle: "", target: ""},
        {name: "在线设备", img: "iconInfo1.png", toggle: "", target: ""},
        {name: "连接秘钥", img: "iconInfo2.png", toggle: "modal", target: "#codeModal"},
        {name: "管理设备", img: "iconInfo3.png", toggle: "modal", target: "#devModal"},
      ]
    }
  }
}
</script>

<style scoped>
/* #u0 {
  background-color: yellow;
} */
.hide {
  display: none !important;
}
#main-content-sum>div {
  height: 80px;
  font: 20px/80px sans-serif;

}
#main-content-sum>ul {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 50px; */
}
#main-content-sum li {
  width: 300px;
  height: 120px;
  background-color: rgba(255,255,255,0.7);
  position: relative;
  border-radius: 10px;
  cursor: pointer;
}
#main-content-sum li>img {
  display: block;
  position: relative;
  left: 20px;
  top: 20PX;
  width:  80px;
  height: 80px;
  /* background-color: gray; */
}
#main-content-sum li>span:nth-of-type(1){
  position: absolute;
  left: 170px;
  top: 30px;
}
#main-content-sum li>span:nth-of-type(2){
  position: absolute;
  left: 200px;
  top: 60px;
}
#main-content-detail>div {
  height: 80px;
  font: 20px/80px ;
  margin-right: 20px;
}
#showDev>tr {
  font: 20px/80px sans-serif;
}


#devModal .modal-content {

  width: 800px;
  height: 500px;
}
#devModal .modal-body>div {
  font-weight: bolder;
  color: rgb(61, 139, 253);
  height: 50px;
}
#devModal .modal-body>div span {
  display: inline-block;
  font: bolder 20px/50px 微软雅黑;
  width: 300px;
  margin-right: 10px;
  /* background-color: orange; */
}
#devModal .modal-footer {
  padding-right: 44px;
}
.devListModal {
  height: 50px;
}
.devListModal span {
  display: inline-block;
  font: 20px/50px sans-serif;
}
.devShow>span:nth-of-type(1) {
  width: 300px;
  margin-right: 5px;
}
.devShow>span:nth-of-type(2) {
  width: 300px;
}
.devShow>span:nth-of-type(3), .devShow>span:nth-of-type(4){
  cursor: pointer;
  margin-left: 20px;
}
.devChange>button {
  width: 70px;
  height: 35px;
}

.editDevName, .editDevId {
  display: inline-block;
  width: 300px;
  margin-right: 5px;
}



#devInput1 {
  width: 200px;
  height: 30px;
}
#devInput2 {
  width: 300px;
  height: 30px;
  margin-right: 20px;
}
#refreshDevBtn {
  height: 60px;
  font: 18px/60px sans-serif;
  /* margin-left: 20px; */
}


.devShow>span:nth-of-type(3):hover {
  color: #198754;
}
.devShow>span:nth-of-type(4):hover {
  color: rgb(220, 53, 69);
}
#refreshDevBtn:hover {
  color: rgb(61, 139, 253);
  cursor: pointer;
}
</style>