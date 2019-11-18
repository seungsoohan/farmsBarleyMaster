import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';

import axios from 'axios'
import moment from 'vue-moment'

import VueMaterial from 'vue-material';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-material/dist/vue-material.min.css';
import BootstrapVue from 'bootstrap-vue'

import Loading from 'vue-loading-overlay'

// import { MainPage } from './test/MainPage.vue'

import MainOrderPage from './components/MainOrder.vue'

Vue.config.productionTip = false


Vue.use(VueRouter); // router 기능 확장 선언
Vue.use(BootstrapVue)
Vue.use(VueMaterial)
Vue.use(moment)
Vue.use(Loading);

const MenuTab = { template: '<div></div>' }

const routes = [
  // {
  //   path: '/',
  //   component: MainOrderPage
  // },
  {
    path: '/mainTab/:id', component: MainOrderPage,
    children: [
      { path: '', component: MenuTab },
      { path: 'schdule', component: MenuTab },
      { path: 'menu', component: MenuTab }

      // ...또 다른 서브 라우트
    ]
  }
];
const router = new VueRouter({
  mode: 'history',
  routes
});
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
