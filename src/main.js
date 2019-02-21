//----------------------------------------------------------------------------
//    main.js
//
//    Dec 31 2018   Initial
//    Feb 20 2019   Vuex coming in the loop
//----------------------------------------------------------------------------
const Version = 'main.js: 1.04, Feb 20 2019';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import VueSwal from 'vue-swal';
import VueLogger from 'vuejs-logger';


import router from './router';
import store from './store/store';
 
Vue.use(Vuetify);
Vue.use(BootstrapVue);
Vue.use(VueSwal);
Vue.use(VeeValidate);

Vue.config.productionTip = false

const isProduction = process.env.NODE_ENV === 'production';

const options = {
    isEnabled: true,
    logLevel: isProduction ? 'error' : 'debug',
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: true,
    separator: '|',
    showConsoleColors: true,
};
Vue.use(VueLogger, options);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
