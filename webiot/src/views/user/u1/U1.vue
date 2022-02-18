<template>
  <div id='u1-box' v-if="this.$store.state.dataResetOk">
    <div id='tag'>
      <ul class="nav nav-tabs">
        <li v-for="(v,i) in curDevs" :key="i"  @click="changeTag(i)" class="nav-item">
          <a :class="{active: actCtrlIdx===i}" class="nav-link" href="#">{{v.name}}</a>
        </li>
      </ul>
    </div>
    <div id='controller' >
      <div></div>
      <div class="input-group mb-3" id='sendMsgW'>
        <button :disabled="!haveDev" @click="sendMsg" class="btn btn-outline-primary" type="button" id="button-addon1">发送会话</button>
        <input :disabled="!haveDev" v-model="msg" 
        type="text" class="form-control" placeholder="输入应内容小于20字节" aria-label="Example text with button addon" aria-describedby="button-addon1">
      </div>
      <div id="controlNum">
        <button v-for="(v,i) in btns" :key="i" @click="btnClick(i)"
        :disabled="!haveDev" :class="{active: curBtns[actCtrlIdx][i]}"
        type="button" class="btn btn-outline-primary">{{v}}</button>
        <div v-for="(v,i) in Array(4)" :key="i+10" class="controller-range">
          <label :for="`customRange${i+1}`" class="form-label">滑杆{{i+1}}&nbsp;&nbsp;&nbsp;<span>[ {{curRans[actCtrlIdx][i]}} ]</span></label>
          <input :disabled="!haveDev" :id="`customRange${i+1}`" 
          :value="curRans[actCtrlIdx][i]" @change="changeRan(i, $event)"
          type="range" class="form-range" min="0" max='100' >
        </div>
      </div>
    </div>
    <p-comment :c_actDid="actDid" />
  </div>
</template>

<script>
import PComment from "components/private/PComment"
import throttle from "utils/throttle"
import getTextLen from "utils/getTextLen"
export default {
  data () {
    return {
      btns: ["按钮A", "按钮B", "按钮C", "按钮D"],
      msg: ""
    }
  },
  computed : {
    curName: function () {return this.$store.state.curName},
    curDevs: function () {return this.$store.state.curDevs},
    curBtns: function () {return this.$store.state.curBtns},
    curRans: function () {return this.$store.state.curRans},
    actDid: function () {return this.$store.state.curDevs[this.$store.state.curActCtrlIdx].did},
    haveDev: function () {return this.$store.state.curDevs.length},
    actCtrlIdx: function () {return this.$store.state.curActCtrlIdx}
  },
  components: {
    "p-comment": PComment
  },
  methods: {
    /* 切换设备标签页 */
    changeTag (i) {
      this.$store.commit("changeVal", {k: "curActCtrlIdx", v: i})
    },
    /* 点击按钮 */
    btnClick: throttle(function (i){
      this.$store.commit("changeBtnVal", {k: "curBtns", i: this.actCtrlIdx, j: i})
      this.rBtnVal (this.actDid, this.curName)
    }),
    rBtnVal (did, user) {
      fetch(`/api/ctrl/btnVal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          did, btnArr:this.curBtns[this.actCtrlIdx], user
        })
      })
      .then(res => res.json()
      .then(data => {
        // console.log(data)
      }))      
    },
    /* 拖动滑杆 */
    changeRan: throttle(function (i, ev) {
      this.$store.commit("changeArrVal", {k: "curRans", v: ev.target.value, idx: [this.actCtrlIdx, i]})
      this.rRangeVal(this.actDid, this.curName)
    }),
    rRangeVal (did, user) {
      fetch(`/api/ctrl/rangeVal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          did,ranArr:this.curRans[this.actCtrlIdx],user
        })      
      })
      .then(res => res.json()
      .then(data => {}))      
    },
    /* 发送会话 */
    sendMsg: throttle(function () {
      if (getTextLen(this.msg) <= 20) {
        fetch('/api/ctrl/pubMsgW', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            did:this.actDid, msgW:this.msg, user:this.curName
          })
        })
        .then(res => res.json()
        .then(data => {}))
      } else alert('发送会话内容不得超过20字节')  
    })
  },
  created () {
    this.$clearTim()
  }
}
</script>

<style scoped>
#u1-box {
  width: 100%;
}
#tag {
  margin-top: 20px;
  margin-left: 80px;
}
#tag a {
  color: rgb(173, 181, 189);
}
#tag .active {
  color: rgb(77, 212, 172);
  font-weight: bold;
}
#controller {
  margin-left: 80px;
  width: 1000px;
  height: 800px;
  padding-top: 20px;
  float: left;
}

#sendMsgW {
  margin-top: 30px;
}


#controlNum {
  margin-top: 50px;
}
#controlNum>button {
  width: 100px;
  height: 50px;
  margin-right: 100px;
}
.controller-range {
  margin-top: 50px;
}
.controller-range span {
  color: rgb(61, 141, 233);
}
</style>