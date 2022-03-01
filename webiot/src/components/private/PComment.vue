<!-- comment -->
<template>
  <div id='comment'>
    <div id='note-btn'>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div @click="noteClick" id='note-content' 
    :class="{'init-content': !clickFlag, 'pop-content': clickFlag==1, 'back-content': clickFlag==2}">
      <div id="note-tab">
        <ul>
          <li v-for="(v, i) in commentIcons" :key="i" :id="v.id" @click.stop="iconClick(i)">
            <a v-if="i === 1" :href="v.link" target="_blank"><img :src="require(`img/comment/${v.img}`)" alt=""></a> 
            <img v-else :src="require(`img/comment/${v.img}`)" alt="">
          </li>
        </ul>
      </div>
      <div v-show="!commentMode" id='note-textarea' class="mb-3">
        <textarea  v-model="comment" 
        class="form-control form-control-lg" id="textarea1" rows="17"></textarea>
        <div id='note-count'> <span>{{charCount}}</span> 字节</div>
      </div>
      <div v-show="commentMode" id='note-md' class="text-wrap text-break">
        <span v-html="commentMd"></span>
        <span v-if="!comment">comment refreshing...</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {marked} from "marked"
  // const marked
  import getTextLen from "utils/getTextLen"

  export default {
    data () {
      return {
        commentIcons: [
          {id: "noteEdit", img: "noteCtrl1.png"},
          {id: "noteHelp", img: "noteCtrl3.png", link: "https://markdown.com.cn/basic-syntax/"},
          {id: "noteMini", img: "noteCtrl4.png"}
        ],
        //0-收，1-缓出，2-缓进
        clickFlag: 0,
        commentMode: 1,
        comment: "", 
      };
    },
    props: {
      c_actDid: Number,
    },
    computed: {
      commentMd: function () {return marked.parse(this.comment)},
      charCount: function () {return getTextLen(this.comment)}
    },
    methods: {
      noteClick () {
        this.clickFlag = 1
      },
      iconClick (i) {
        switch (i) {
          case 0:
            this.commentMode = !this.commentMode
            if (this.commentMode) {
              this.rChangeNote(this.c_actDid)
              this.commentIcons[0].img = "noteCtrl1.png"
            } else {
              this.commentIcons[0].img = "noteCtrl2.png"
            } 
            break
          case 2:
            this.clickFlag = 2
            setTimeout(()=>{this.clickFlag = 0}, 600)
            break
          default:
            break
        }
      },
      /* 请求注释内容 */
      rReqNote () {
        fetch(`/api/data/devNote?did=${this.c_actDid}`)
        .then(r => r.json()
        .then(data => {
          this.comment = data.val
        }))
      },
      /* 更新注释内容 */
      rChangeNote (did) {
        fetch(`/api/data/changeNote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            did, comment:this.comment
          })
        })
        .then(res => res.json()
        .then(data => {}))        
      },
    },
    created () {
      this.rReqNote()
    },
    beforeDestroy () {
      this.rChangeNote(this.c_actDid)
    },
    watch: {
      c_actDid (newVal, preVal) {
        this.clickFlag = 0
        this.commentMode = 1
        ;(async () => {
          try {
            await this.rChangeNote(preVal)
            await this.rReqNote() 
          } catch (e) {console.log(e)}
        })()     
      }
    } 
  }
</script>

<style lang='css' scoped>
#comment {
  width: 515px;
  height: 620px;
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
}
#note-btn {
  width: 35px;
  height: 620px;
  float: right;
  position: relative;
  overflow: hidden;
}
#note-btn>div:first-of-type {
  width: 35px;
  height: 620px;
  background: url('~img/comment/note1.png') center/cover no-repeat;
  position: absolute;
  left: 0;
  top: 0;
}
#note-btn>div:last-of-type {
  width: 10px;
  height: 620px;
  background: url('~img/comment/note3.png') center/cover no-repeat;
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
}
#note-content {
  background-color: rgb(255,247,209);
  position: absolute;
  z-index: 1;
  border-radius: 6px;
  top: 10px;
  width: 500px;
  height: 600px;
  overflow: hidden;
}
.init-content {
  right: -480px;
  cursor: pointer;
}
.pop-content {
  animation: popNote 0.6s forwards;
}
.back-content {
  animation: backNote 0.6s forwards;
}
#note-tab {
  margin-top: 10px;
  width: 100%;
  height: 25px;
}
#note-tab>ul {
  margin-right: 10px;
  float: right;
}
#note-tab li {
  display: inline-block;
  width: 35px;
  height: 25px;
  cursor: pointer;
  margin-left: 10px;
}
#note-tab li>img {
  width: 25px;
  height: 25px;
}
#note-textarea {
  margin-left: 10px;
  width: 480px;
}
#note-md {
  padding: 10px;
  overflow-y: auto;
  width: 490px;
  height: 560px;
}
#note-md img {
  max-width: 450px;
}
#note-count {
  float: right;
  margin-top: 3px;
  margin-right: 10px;
  font: 12px sans-serif;
  color: grey;
}

.init-content:hover {
  animation: hoverNote 1s ease forwards;
}

@keyframes hoverNote {
  from {right: -480px;}
  to {right: -440px;}
}
@keyframes popNote {
  from {right: -460px;}
  to {right: 10px;}
}
@keyframes backNote {
  from {right: 10px;}
  to {right: -480px;}
}
</style>