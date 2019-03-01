import Vue from 'vue';
import SuiVue from 'semantic-ui-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'semantic-ui-css/semantic.min.css';

Vue.config.productionTip = false;

Vue.use(SuiVue);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
