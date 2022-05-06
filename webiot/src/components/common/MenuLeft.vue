<template>
  <div id="menu">
    <ul>
      <li @click="changePage(menuHead.path)">{{menuHead.name}}</li>
      <li v-for="(v, i) in menuInfo" :key="i" @click="changePage(v.path)">{{v.name}}</li>
      <div id="logo"></div>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuHead: {name: "创趣物联", path: "intro"},
      menuInfo: [
        {name: "设备信息", path: "device"},
        {name: "控制界面", path: "ctrl"},
        {name: "数据监控", path: "data"}
      ]
    }
  },
  methods: {
    changePage (p) {
      this.$router.push(`/user/${p}`)
    }
  }
}
</script>

<style scoped>
  #menu {
    position: fixed;
    width: 200px;
    height: 120vh;
    background-color: var(--rMainColor);
    color: white;
    z-index: 2;
  }
  #menu>ul {
    padding-left: 0;
    /* position: relative; */
  }
  #menu li:first-of-type {
    background-color: var(--rMainColorDark);
  }
  #menu li {
    padding-left: 32px;
    font: 17px/80px sans-serif;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    cursor: pointer;
  }
  #logo {
    width: 120px;
    height: calc(120px/1.4);
    position: fixed;
    background: url("~img/user/logoW.png") center/contain no-repeat;
    bottom: 2rem;
    left: 32px;
    /* transform: translate(-50%); */
    opacity: 0.15;
  }
</style>