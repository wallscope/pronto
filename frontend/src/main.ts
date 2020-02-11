import Vue from 'vue';
import SuiVue from 'semantic-ui-vue';
import Toasted from 'vue-toasted';

import App from './App.vue';
import router from './router';
import store from './store';
import 'semantic-ui-css/semantic.min.css';

Vue.config.productionTip = false;

Vue.use(SuiVue);
Vue.use(Toasted, {
  position: 'top-center',
  theme: 'outline',
  duration: 3000,
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
