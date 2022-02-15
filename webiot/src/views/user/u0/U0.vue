/* device */
<template>
  <div id="u0">
    <div id='main-content-sum' style="margin-left: 80px; padding-right: 100px;">
    <div>概览</div>
    <ul>
      <li v-for="(v,i) in devIcons" :key="i" :data-bs-toggle="v.toggle" :data-bs-target="v.target">
        <img :src="require(`img/u0/iconInfo0.png`)" alt="">
        <span>{{v.name}}</span>
        <span v-if="i<2">{{v.count}}</span>
      </li>
    </ul>
    </div>
    <div id='main-content-detail' style="margin-left: 80px;">
    <div id='refreshDevBtn'>[状态刷新]</div>
    <div>
      <table class="table table-hover">
        <thead>
          <tr>
          <th v-for="(v, i) in ths" :key="i" scope="col">{{v}}</th>
          </tr>
        </thead>
        <tbody id='showDev'>
          <tr v-for="(v,i) in devs" :key="i" >
            <th scope="row">{{v.name}}</th>
            <td>{{v.did}}</td>
            <td>{{v.state? "在线":"离线"}}</td>
          </tr>
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
        <li v-for="(v,i) in devs" :key="i" class='devListModal'>
          <div class='devShow'>
            <span>{{v.name}}</span>
            <span>{{v.did}}</span>
            <span class='devEdit'>编辑</span>
            <span class='devDelete'>删除</span>
          </div>
          <div class='devChange hide'>
            <input type="text" class="form-control editDevName"  >
            <input type="text" class="form-control editDevId" >
            <button type="button" class="btn btn-outline-success align-top">确定</button>
            <button type="button" class="btn btn-outline-danger align-top">取消</button>
          </div>                     
        </li>  
      </ul>
    </div>
    <div class="modal-footer">
      <input v-model="newDev.name" type="text" class="form-control" id="devInput1" placeholder="输入设备名称">
      <input v-model="newDev.did" type="text" class="form-control" id="devInput2" placeholder="输入设备ID(1-255)">
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
      {{code}}
    </div>
    <div class="modal-footer">
      <button @click="rGenCode(1)" type="button" class="btn btn-secondary" id='genCodeBtn'>生成</button>
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
      devIcons: [
        {name: "设备总量", img: "iconInfo0.png", count: 0, toggle: null, target: null},
        {name: "在线设备", img: "iconInfo1.png", count:0, toggle: null, target: null},
        {name: "连接秘钥", img: "iconInfo2.png", toggle: "modal", target: "#codeModal"},
        {name: "管理设备", img: "iconInfo3.png", toggle: "modal", target: "#devModal"},
      ],
      ths: ["名称","id","状态"],
      code: "",
      devs: [],
      newDev: {name: "", did: undefined}
    }
  },
  methods: {
    /* 0-获得/1-刷新 通讯密钥 */
    rGenCode (i) {
      fetch(`/api/user/getCode?i=${i}`)
      .then(res => res.json()
      .then(data => {
        this.code = data.code
        // curCode = data.code
      })).catch(e=>console.log(e))      
    },
    /* 获取设备信息 */
    rGetDevList () {
      return new Promise((resolve, reject) => {
        fetch(`/api/dev/getDevlist`)
        .then(res => res.json()
        .then(data => {
          this.devs = data.data
          this.devIcons[0].count = this.devs.length
          this.devIcons[1].count = 0
          for(let v of this.devs) {
            if (v.state) this.devIcons[1].count+=1
          }
          // 【待测:在线、总量计数更新，未添加:全局变量更新】
          resolve()
        }))
        .catch(e => reject())
      })
    },
    rRegDev () {
      let name = $('#devInput1').val()
      let did = newDid
      let auth = curAuth
      if (name&&did) {
        fetch('/dev/regDev', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            name,
            did,
            auth
          })
        })
        .then(res => res.json()
        .then(data => {
          // console.log('%%%%', data)
          if (data.err) alert(`err${data.err}: ${data.val}`)
          else {
            curBtns.push([0,0,0,0]) 
            curRans.push([0,0,0,0])
            timData.push(Array(8))
            dataState.push(Array(9).fill(0).concat(-1))
            graCache.push(Array(8).fill(0).map(e => Array()))
          }
          console.log(graCache)
          resolve()  
        }))
        .catch(e => reject())
      }         
    },
    devRegOk (newDid, newDevName) {
      // 不为空
      if (!(parseInt(newDid) && newDevName)) return false
      // 1-255
      let did = parseInt(newDid)
      if (!(did>=1 && did<=255)) {
        alert('设备id为1-255的整数')
        return false 
      } else {
        let anyOk = true
        this.devs.forEach(function (v) {
          if (newDid == v.did) {
            anyOk = false
            alert(`你已经有一个ID:${v.did}设备了, 换个ID吧`)
            return 0
          }
          if (newDevName == v.name) {
            anyOk = false
            alert(`你已经有一个${v.name}了, 换个名字吧`)
            return 0
          }
        })

        if (!anyOk) return false
        else return did
      }
    }      
  },
  created () {
    this.rGenCode(0)
    this.rGetDevList()
  }
}
</script>

<style scoped>
.hide {
  display: none !important;
}
#u0 {
  width: 100%;
}
#main-content-sum>div {
  height: 80px;
  font: 20px/80px sans-serif;

}
#main-content-sum>ul {
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