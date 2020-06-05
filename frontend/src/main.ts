import Vue from 'vue';
import SuiVue from 'semantic-ui-vue';
import Toasted from 'vue-toasted';
import VueGtag from 'vue-gtag';

import App from './App.vue';
import router from './router';
import store from './store';
import 'semantic-ui-css/semantic.min.css';
import '@/rdf-ontologies/search';

Vue.config.productionTip = false;

Vue.use(SuiVue);
Vue.use(Toasted, {
  position: 'top-center',
  theme: 'outline',
  duration: 3000,
});
Vue.use(
  VueGtag,
  {
    config: {
      id: process.env.VUE_APP_GTAG_ID,
    },
    // only enable after cookie consent
    bootstrap: localStorage.getItem('vue-cookie-accept-decline-cookie-consent') === 'accept',
  },
  router,
);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
