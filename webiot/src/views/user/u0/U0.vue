/* device */
<template>
  <div id="u0">
    <div id='main-content-sum' style="margin-left: 80px; padding-right: 100px;">
    <div>概览</div>
    <ul>
      <li v-for="(v,i) in devIcons" :key="i" :data-bs-toggle="v.toggle" :data-bs-target="v.target">
        <img :src="require(`img/u0/iconInfo0.png`)" alt="">
        <span>{{v.name}}</span>
        <span v-if="i==0">{{allCount}}</span>
        <span v-if="i==1">{{olCount}}</span>
      </li>
    </ul>
    </div>
    <div id='main-content-detail' style="margin-left: 80px; margin-top:50px">
    <!-- <div id='refreshDevBtn'>[状态刷新]</div> -->
    <div>
      <table class="table table-hover">
        <thead>
          <tr>
          <th v-for="(v, i) in ths" :key="i" scope="col">{{v}}</th>
          </tr>
        </thead>
        <tbody id='showDev'>
          <tr v-for="(v,i) in $store.state.curDevs" :key="i" >
            <th scope="row">{{v.name}}</th>
            <td>{{v.did}}</td>
            <td>{{v.state? "在线":"离线"}}</td>
          </tr>        
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
      <button @click="editIdx=-1" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div>
        <span>名称</span><span>ID</span>
      </div>
      <ul id="devModalUl">
        <li v-for="(v,i) in $store.state.curDevs" :key="i" class='devListModal'>
          <div class='devShow' v-show="editIdx !== i">
            <span>{{v.name}}</span>
            <span>{{v.did}}</span>
            <span @click="editClick(v.name, v.did, i)" class='devEdit'>编辑</span>
            <span @click="delDev(i)" class='devDelete'>删除</span>
          </div>
          <div class='devChange' v-show="editIdx === i">
            <input v-model="editName" type="text" class="form-control editDevName"  >
            <input v-model="editDid" type="text" class="form-control editDevId" >
            <button @click="editDev(v.name, v.did, i)" type="button" class="btn btn-outline-success align-top">确定</button>
            <button @click="editIdx=-1" type="button" class="btn btn-outline-danger align-top">取消</button>
          </div>                     
        </li>  
      </ul>
    </div>
    <div class="modal-footer">
      <input v-model="newDev.name" type="text" class="form-control" id="devInput1" placeholder="输入设备名称">
      <input v-model="newDev.did" type="text" class="form-control" id="devInput2" placeholder="输入设备ID(1-255)">
      <button @click="regNewDev" :disabled="editIdx != -1" type="button" class="btn btn-primary" id='regDevBtn' >新增设备</button>
      <button @click="editIdx=-1" type="button" class="btn btn-secondary" data-bs-dismiss="modal">返回</button>
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
        {name: "设备总量", img: "iconInfo0.png", toggle: null, target: null},
        {name: "在线设备", img: "iconInfo1.png", toggle: null, target: null},
        {name: "连接秘钥", img: "iconInfo2.png", toggle: "modal", target: "#codeModal"},
        {name: "管理设备", img: "iconInfo3.png", toggle: "modal", target: "#devModal"},
      ],
      ths: ["名称","id","状态"],
      code: "",
      newDev: {name: "", did: undefined},
      editIdx: -1, editName: "", editDid: undefined
    }
  },
  computed: {
    allCount: function () {
      return this.$store.state.curDevs.length
    },
    olCount: function () {
      let n = 0
      for(let v of this.$store.state.curDevs) {
        if (v.state) n+=1
      }
      return n
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
          this.$store.commit("changeVal", {k:"curDevs", v:data.data})
          // console.log(data.data)
          resolve()
        }))
        .catch(e => reject())
      })
    },
    /* 注册新设备 */
    regNewDev () {
      let newDid = this.devRegOk(this.newDev.name, this.newDev.did)
      if (newDid) {
        ;(async () => {
          try {
            await this.rRegDev(newDid)
            await this.rGetDevList()
          } catch (e) {console.log(e)}          
          // console.log('rRegDev')
        })()
      }
    },
    rRegDev (newDid) {
      return new Promise((resolve, reject) => {
      let name = this.newDev.name
      let did = newDid
      let auth = this.$store.state.curAuth
      if (name&&did) {
        fetch('/api/dev/regDev', {
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
            this.$store.commit("addNewDev")
            alert(`设备添加成功! ID:${did} 名称:${name}`)
          }
          resolve()  
        }))
      } 
      })
    },
    // 注册/编辑设备验证
    devRegOk (newDevName, newDid, ignoreIdx=-1) {
      // 不为空
      if (!(parseInt(newDid) && newDevName)) return false
      // 1-255
      let did = parseInt(newDid)
      if (!(did>=1 && did<=255)) {
        alert('设备id为1-255的整数')
        return false 
      } else {
        let anyOk = true
        this.$store.state.curDevs.forEach(function (v,i) {
          if (ignoreIdx !== i) {
            if (did == v.did) {
              anyOk = false
              alert(`你已经有一个ID:${v.did}设备了, 换个ID吧`)
              return 0
            }
            if (newDevName == v.name) {
              anyOk = false
              alert(`你已经有一个${v.name}了, 换个名字吧`)
              return 0
            }
          }
        })

        if (!anyOk) return false
        else return did
      }
    },
    /* 删除设备 */
    delDev (i) {
      let did = this.$store.state.curDevs[i].did
      // console.log(this.allCount)
      if (this.allCount>1) {
        ;(async () => {
          try {
            await this.rDeleteDev(did)
            await this.rGetDevList()
            this.$store.commit("delDev", i)
          } catch (e) {console.log(e)}
        })()  
      } else alert("手下留情, 这已经是你最后一个设备了")
    },
    rDeleteDev (did) {
      return new Promise((resolve, reject) => {
        fetch(`/api/dev/delDev?did=${did}`)
        .then(res => res.json()
        .then(data => {
          resolve()
        }))
      })      
    },  
    /* 修改编辑设备 */
    editClick (name, did, i) {
      this.editName = name
      this.editDid = did
      this.editIdx = i
    },
    editDev (preName, preDid, i) {
      let newName = this.editName, newDid = this.editDid
      try {
        if (!(preName==newName && preDid==newDid))
        {
          let did = this.devRegOk(newName, newDid, i)
          if (did) {
            ;(async () => {
              await this.rEditDevInfo(preDid, newName, did)
              await this.rGetDevList()
            })()
          }
        }
      } catch (e) {console.log(e)} 
      this.editIdx = -1 
    },
    rEditDevInfo (preDid, newName, newDid) {
      return fetch('/api/dev/changeDevInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          preDid,
          newName,
          newDid
        })       
      })
      .then(res => res.json()
      .then(data => {alert(data.msg)}))      
    }

  },
  created () {
    this.rGenCode(0)
    this.rGetDevList()
  }
}
</script>

<style src="views/user/u0/u0.css" scoped></style>