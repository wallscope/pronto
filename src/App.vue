<template lang="pug">
  #app
    Header
    #main
      #nav
        router-link(to='/') Home
        |  |&nbsp
        router-link(to='/about') About
      keep-alive
        router-view

    Footer

</template>
<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">
#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #4183c4;
    }
  }
}
#main {
  margin-top: 2.5em;
  flex: 1;
}
#Footer {
  margin-top: 2em;
}
</style>
