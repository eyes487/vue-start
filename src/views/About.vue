
<template>
  <div class="about">
    <div id="nav" class="nav">
      <router-link to="/about/info">info</router-link>
      <router-link to="/about/setting">setting</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      msg: 'About',
      name: 'xiaomei'
    }
  }
}
</script>

<style>
.nav {
  margin-top: 10px;
}
</style>