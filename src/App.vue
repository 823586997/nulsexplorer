<template>
  <div id="app" class="app">
    <HeaderBar></HeaderBar>
    <router-view></router-view>
    <BottomBar></BottomBar>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar'
import BottomBar from './components/BottomBar'

export default {
  components: {
    HeaderBar,
    BottomBar
  }
}
</script>

<style lang="less">
@import "assets/css/base.less";
  .app{
    background-color: #ffffff;
  }
  #app {
    width: 100%;
    height: 100%;
    min-height: 100%;
}
html, body {
    height: 100%;
    background-color: #ffffff;
}
</style>
