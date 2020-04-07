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

    vue-cookie-accept-decline(
      ref="cookie-consent"
      elementId="cookie-consent"
      position="bottom-right"
      type="floating"
      transitionName="slideFromBottom"
      @clicked-accept="cookieClickedAccept()"
    )
      div(slot="acceptContent") Agree

    Footer

</template>
<script>
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css';
import { setOptions, bootstrap } from 'vue-gtag';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    VueCookieAcceptDecline,
    Header,
    Footer,
  },
  methods: {
    async cookieClickedAccept() {
      await bootstrap();
    },
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
  margin-top: 15px;
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
