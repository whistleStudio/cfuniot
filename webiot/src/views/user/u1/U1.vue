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
        <div v-for="(v,i) in btns" :key="i" class="controller-btn">
          <button @click="btnClick(i)" @mousedown="btnDown(i)" @mouseup="btnUp(i)"
          :disabled="!haveDev" :class="{active: curBtns[actCtrlIdx][i]}" type="button" class="btn btn-outline-primary">{{v}}</button>
          <div class="pin" @click="pinClick(i)" :style="{backgroundImage: `url(${require('img/u1/pin'+curBtnMode[actCtrlIdx][i]+'.png')})`}"></div>
        </div>
        <div v-for="(v,i) in Array(4)" :key="i+10" class="controller-range">
          <label :for="`customRange${i+1}`" class="form-label">滑杆{{String.fromCharCode(65+i)}}&nbsp;&nbsp;&nbsp;<span>[ {{curRans[actCtrlIdx][i]}} ]</span></label>
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
const PComment = res => require(["components/private/PComment"], res)
import throttle from "utils/throttle"
import getTextLen from "utils/getTextLen"
export default {
  data () {
    return {
      btns: ["按钮A", "按钮B", "按钮C", "按钮D"],
      msg: "",
      actCtrlIdx: 0,
    }
  },
  computed : {
    curName: function () {return this.$store.state.curName},
    curDevs: function () {return this.$store.state.curDevs},
    curBtns: function () {return this.$store.state.curBtns},
    curRans: function () {return this.$store.state.curRans},
    actDid: function () {return this.$store.state.curDevs[this.actCtrlIdx].did},
    haveDev: function () {return this.$store.state.curDevs.length},
    curBtnMode () {return this.$store.state.curBtnMode}
  },
  components: {
    "p-comment": PComment
  },
  methods: {
    /* 切换设备标签页 */
    changeTag (i) {
      this.actCtrlIdx = i
    },
    /* 点击按钮 */
    btnClick: throttle(function (i){
      if (this.curBtnMode[this.actCtrlIdx][i]) {
        this.$store.commit("changeBtnVal", {k: "curBtns", i: this.actCtrlIdx, j: i})
        this.rBtnVal (this.actDid, this.curName)
        console.log("pin 1 send")
      }
    }),
    btnDown (i) {
      if (this.curBtnMode[this.actCtrlIdx][i]==0) {
        this.$store.commit("changeBtnVal", {k: "curBtns", i: this.actCtrlIdx, j: i})
        this.rBtnVal (this.actDid, this.curName)
        console.log("pin 0 down")
      }
    },
    btnUp (i) {
      if (this.curBtnMode[this.actCtrlIdx][i]==0) {
        this.$store.commit("changeBtnVal", {k: "curBtns", i: this.actCtrlIdx, j: i})
        this.rBtnVal (this.actDid, this.curName)
        console.log("pin 0 up")
      }
    },
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
    }),
    /* 按钮模式切换（图钉📌） */
    pinClick (i) {
      this.$store.commit("changeBtnVal", {k: "curBtnMode", i: this.actCtrlIdx, j: i})
      // 每次点击图钉都会置0
      this.$store.commit("changeArrVal", {k: "curBtns", v: 0, idx: [this.actCtrlIdx, i]})
      this.rBtnVal (this.actDid, this.curName)
    }
  },

}
</script>

<style src="./u1.css" scoped></style>