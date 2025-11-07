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
      <div class="topic-hint-text">自定义发布主题</div>
      <!-- 新增：发布多主题行（设备级pubTopics，可编辑、最多5，最少1） -->
      <div id="multiPub" style="margin-bottom:20px;">
        <div v-for="(topic, idx) in pubTopics" :key="idx" style="display:flex;align-items:center;margin-bottom:8px;">
          <button :disabled="!haveDev" @click="sendPub(idx)" class="btn btn-outline-primary" type="button" style="margin-right:8px;">发送</button>
          <label style="margin-right:6px;">主题：</label>
          <input v-model="pubTopics[idx]" type="text" class="form-control" style="width:180px;margin-right:10px;" placeholder="主题名">
          <label style="margin-right:6px;">内容：</label>
          <input v-model="pubMsgs[idx]" type="text" class="form-control" style="flex:1;margin-right:10px;" placeholder="输入内容小于20字节">
          <button v-if="pubTopics.length>1" @click="removePubTopic(idx)" class="btn btn-sm btn-danger" type="button">删除</button>
        </div>
        <div style="margin-top:6px;">
          <button @click="addPubTopic" class="btn btn-sm btn-primary" :disabled="pubTopics.length>=5">+</button>
          <button @click="savePubTopics" class="btn btn-sm btn-outline-success" style="margin-left:8px;">保存主题</button>
          <small style="margin-left:12px;color:#777;">最少1项，最多5项。保存后在下次登录恢复。</small>
        </div>
      </div>

      <!-- <div class="input-group mb-3" id='sendMsgW' style="display:none;">
        <button :disabled="!haveDev" @click="sendMsg" class="btn btn-outline-primary" type="button" id="button-addon1">发送会话</button>
        <input :disabled="!haveDev" v-model="msg" 
        type="text" class="form-control" placeholder="输入应内容小于20字节" aria-label="Example text with button addon" aria-describedby="button-addon1">
      </div> -->
      <div id="controlNum">
        <div class="topic-hint-text">按钮（主题：Cbtn）</div>
        <div v-for="(v,i) in btns" :key="i" class="controller-btn">
          <button @click="btnClick(i)" @mousedown="btnDown(i)" @mouseup="btnUp(i)"
          :disabled="!haveDev" :class="{active: curBtns[actCtrlIdx][i]}" type="button" class="btn btn-outline-primary">{{v}}</button>
          <div class="pin" @click="pinClick(i)" :style="{backgroundImage: `url(${require('img/u1/pin'+curBtnMode[actCtrlIdx][i]+'.png')})`}"></div>
        </div>

        <div class="topic-hint-text">滑杆（主题：Cran）</div>
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
      // 新增：可发布主题数组（按设备加载），以及每行的输入内容数组
      pubTopics: [], 
      pubMsgs: []
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
      // 切换设备时加载对应设备的 pubTopics
      this.loadPubTopics()
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
    /* 发送会话（保留） */
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
    },

    /* ========== 新增：发布多主题相关（按设备） ========== */
    // 加载当前设备的发布主题（调用时会检查是否有设备）
    loadPubTopics() {
      if (!this.haveDev) {
        this.pubTopics = ['CmsgW']
        this.pubMsgs = ['']
        return
      }
      const did = this.actDid
      fetch(`/api/dev/getPubTopics?did=${did}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.err === 0 && Array.isArray(data.pubTopics)) {
            let pts = data.pubTopics.slice(0,5)
            if (pts.length < 1) pts = ['CmsgW']
            this.pubTopics = pts.map(s => s || '')
            this.pubMsgs = this.pubTopics.map(() => '')
          } else {
            this.pubTopics = ['CmsgW']; this.pubMsgs = ['']
          }
        }).catch(e => {
          console.log('loadPubTopics fail', e)
          this.pubTopics = ['CmsgW']; this.pubMsgs = ['']
        })
    },
    addPubTopic() {
      if (this.pubTopics.length >= 5) return
      this.pubTopics.push('')
      this.pubMsgs.push('')
    },
    removePubTopic(idx) {
      if (this.pubTopics.length <= 1) return
      this.pubTopics.splice(idx, 1)
      this.pubMsgs.splice(idx, 1)
    },
    savePubTopics() {
      if (!this.haveDev) { alert('无设备'); return }
      let pts = this.pubTopics.map(s => (s||'').toString().trim()).filter(s => s !== '')
      if (pts.length < 1) { alert('至少保留一项主题'); return }
      if (pts.length > 5) pts = pts.slice(0,5)
      fetch('/api/dev/updatePubTopics', {
        method: 'POST',
        headers: {'Content-Type':'application/json;charset=utf-8'},
        body: JSON.stringify({ did: this.actDid, pubTopics: pts })
      }).then(res => res.json())
      .then(data => {
        if (data && data.err === 0) {
          this.pubTopics = pts
          this.pubMsgs = this.pubTopics.map((_) => '')
          alert('主题保存成功')
        } else {
          alert('保存失败：' + (data.msg || '未知错误'))
        }
      }).catch(e => {
        console.log(e); alert('保存失败')
      })
    },
    sendPub(idx) {
      if (!this.haveDev) { alert('无设备'); return }
      const topic = (this.pubTopics[idx] || '').toString().trim()
      const msg = (this.pubMsgs[idx] || '').toString()
      if (!topic) { alert('主题不能为空'); return }
      if (getTextLen(msg) > 20) { alert('消息不得超过20字节'); return }
      fetch('/api/ctrl/pubMsgW', {
        method: 'POST',
        headers: {'Content-Type':'application/json;charset=utf-8'},
        body: JSON.stringify({ did: this.actDid, msgW: msg, user: this.curName, topic })
      }).then(res => res.json())
      .then(data => {
        // 可加成功提示或清空输入
        console.log('sendPub resp', data)
      }).catch(e => console.log(e))
    }
    /* ========== /新增结束 ========== */
  },
  created() {
    // 初始加载当前设备的 pubTopics（如果 curDevs 尚未准备好，可在切换设备时加载）
    // 若页面创建时已有设备则立即加载
    if (this.haveDev) this.loadPubTopics()
  },
  mounted() {
    // 保持原行为
  }
}
</script>

<style src="./u1.css" scoped></style>