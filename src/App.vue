<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
#app .app-main {
  background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  width: 100%;
  position: absolute;
  top: 50px;
  bottom: 0px;
  left: 0px;
}
</style>
