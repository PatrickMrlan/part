<template>
  <div class="echartbox">
    <span id="fullScreenTXT" class="text screen" @click="fullScreen">全屏</span>
    <span id="fullScreenTXT" class="text exitscreen" @click="fullExit">退出</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    fullScreen() {
      document.getElementsByClassName("exitscreen")[0].style.display = "block";
      document.getElementsByClassName("screen")[0].style.display = "none";
      var element = document.documentElement; //若要全屏页面中div，var element= document.getElementById("divID");
      //IE 10及以下ActiveXObject
      if (window.ActiveXObject) {
        var WsShell = new ActiveXObject("WScript.Shell");
        WsShell.SendKeys("{F11}");
      }
      //HTML W3C 提议
      else if (element.requestFullScreen) {
        element.requestFullScreen();
      }
      //IE11
      else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      // Webkit (works in Safari5.1 and Chrome 15)
      else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
      // Firefox (works in nightly)
      else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
    },
    //退出全屏
    fullExit() {
      document.getElementsByClassName("exitscreen")[0].style.display = "none";
      document.getElementsByClassName("screen")[0].style.display = "block";
      var element = document.documentElement; //若要全屏页面中div，var element= document.getElementById("divID");
      //IE ActiveXObject
      if (window.ActiveXObject) {
        var WsShell = new ActiveXObject("WScript.Shell");
        WsShell.SendKeys("{F11}");
      }
      //HTML5 W3C 提议
      else if (element.requestFullScreen) {
        document.exitFullscreen();
      }
      //IE 11
      else if (element.msRequestFullscreen) {
        document.msExitFullscreen();
      }
      // Webkit (works in Safari5.1 and Chrome 15)
      else if (element.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.echartbox {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/img/echarts/echart.png") no-repeat;
  position: relative;
  span {
    position: absolute;
    right: 250px;
    top: 20px;
    display: block;
    color: rgb(255, 255, 255);
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid #fff;
    border-radius: 3px;
  }
  .exitscreen{
    display: none;
  }
}
</style>
