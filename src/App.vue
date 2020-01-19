<template>
  <div id="app">
    <TopLineBlock v-if="curPage != 'Login'"/>
    <div style="margin-top: 0.9rem;">
      <router-view/>
    </div>
    <!-- <div style="display: block;"><router-view/></div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TopLineBlock from './components/TopLine'
import { Adaptation } from './util/utils.js'
export default {
  name: 'App',
  computed: {
    ...mapState({
      curPage: state => state.curPage
    })
  },
  components: {
    TopLineBlock
  },
  created () {
    Adaptation()
    window.onresize = () => {
      Adaptation()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
table { overflow: hidden; }
</style>
