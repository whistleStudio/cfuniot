<!-- comment -->
<template>
  <div id='comment'>
    <div id='note-btn'>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div id='note-content' class="init-content">
      <div id="note-tab">
        <ul>
          <li v-for="(v, i) in commentIcons" :key="i" :id="v.id">
            <a v-if="i === 1" :href="v.link"><img :src="require(`img/comment/${v.img}`)" alt=""></a> 
            <img v-else :src="require(`img/comment/${v.img}`)" alt="">
          </li>
          <!-- <li id="noteHelp"> <a href="https://markdown.com.cn/basic-syntax/" target="_blank"><img src="/public/pic/noteCtrl3.png" alt=""></a> </li>
          <li id="noteMini"> <img src="/public/pic/noteCtrl4.png" alt=""> </li> -->
        </ul>
      </div>
      <div id='note-textarea' class="mb-3 hide">
        <textarea class="form-control form-control-lg" id="textarea1" rows="17"></textarea>
        <div id='note-count'> <span>1</span> 字节</div>
      </div>
      <div id='note-md' class="text-wrap text-break">comment refreshing...</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        commentIcons: [
          {id: "noteEdit", img: "noteCtrl1.png"},
          {id: "noteHelp", img: "noteCtrl3.png", link: "https://markdown.com.cn/basic-syntax/"},
          {id: "noteMini", img: "noteCtrl4.png"}
        ]
      };
    },
    components: {},
  }
</script>

<style lang='css' scoped>
#comment {
  width: 515px;
  height: 620px;
  margin-top: 30px;
  float: right;
  position: relative;
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
  /* cursor: pointer; */
}
.init-content {
  right: -480px;
  cursor: pointer;
}
#note-tab {
  margin-top: 10px;
  width: 100%;
  height: 25px;
  /* background-color: red; */
}
#note-tab>ul {
  /* width: 100px; */
  margin-right: 10px;
  float: right;
}
#note-tab li {
  display: inline-block;
  width: 35px;
  height: 25px;
  /* background-color: pink; */
  cursor: pointer;
  margin-left: 10px;
}
#note-tab li>img {
  width: 25px;
  height: 25px;
}
#note-textarea {
  /* margin-top: 5px !important; */
  margin-left: 10px;
  width: 480px;
  /* height: 550px; */
}
#note-md {
  padding: 10px;
  overflow-y: auto;
  /* overflow: scroll;
  overflow-y: auto;
  overflow-x: none; */
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
  animation: hovernote 1s ease forwards;
}

@keyframes hovernote {
  from {right: -480px;}
  to {right: -440px;}
}
</style>