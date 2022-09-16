<!-- intro -->
<template>
  <div id="intro">
    <iframe src="https://dict.cfunworld.com/tutorial/iotguide/%E7%89%A9%E8%81%94%E7%BD%91%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97.html" frameborder="0" ref="ifr"
    width="100%"   scrolling="auto"
    ></iframe>
    <div @click="iframeScroll" id="toTop" ></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      };
    },
    methods: {
      iframeScroll () {
        // this.$refs.ifr.contentWindow.scrollTo({top: 0, behavior: 'smooth'})
        this.$refs.ifr.contentWindow.postMessage("scrollTop",'https://dict.cfunworld.com')
      }
    },
  }
</script>

<style scoped>
iframe {
  height: calc(100vh - 90px);
}
#toTop {
  width: 116px;
  height: 141px;
  position: fixed;
  right: 100px;
  bottom: 50px;
  background: url("~img/intro/toTop.png") center/cover no-repeat;
  cursor: pointer;
}
#toTop:hover {
  animation: jump 1s ease 3 forwards;
}
@keyframes jump {
    0% {bottom: 50px}
    50% {bottom: 80px}
    100% {bottom: 50px}
}
</style>