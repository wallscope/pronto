import Vue from 'vue';
import SuiVue from 'semantic-ui-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCubes, faLongArrowRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import store from './store';
import 'semantic-ui-css/semantic.min.css';

library.add(faCubes, faLongArrowRight);

Vue.component('icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(SuiVue);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
