<template>
  <div class="home">
    <img src="@/assets/logo.png" />
    <p @click="$store.commit('add')">counter: {{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">async counter: {{$store.state.counter}}</p>
    <p >double counter: {{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Home'
    }
  },
}
</script>
