<!--
  App.vue

  Dec 31 2018   Initial
  Jan 01 2019   Test&fix vee-validate problem
  Jan 16 2019   vee-validate problem partially fixed. 
                Still one problem : Cannot read property '$watch' of undefined
                But does not prevent the register page from running
  Jan 22 2019   Add top bar management now...
  Jan 23 2019   Logout process completed
  Jan 24 2019   css
  Jan 31 2019   current_user problem
  Feb 03 2019   Tests with axios.
  Feb 06 2019   Tests with axios..OK now, externalized in axiosutility
  Feb 08 2019   axiosutility...
  Feb 10 2019   Get mongodb status
  Feb 11 2019   mongodb status, check
  Feb 15 2019   mongodb status indicator
  Feb 20 2019   mongodb status indicator.2
  Feb 21 2019   Helloworld changed for welcome
  Mar 05 2019   Mongo status used to manage menu items 
                Use mongostore
  Mar 07 2019   test a new log method from the Vue with logger
  Mar 08 2019   Logger
  Mar 10 2019   This Vue sets the mongo status check timer now (instead of welcome)
                Some changes on variables names
  Mar 12 2019   whoami
  Mar 17 2019   Reset user @ logout

-->
<template>
  <v-app id="app">
    <v-navigation-drawer fixed v-model="drawer" app>
      <!-- Side bar Navigation -->
      <v-list dense>
        <router-link v-bind:to="{ name: 'Home' }" class="side_bar_link">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Home</v-list-tile-content>
          </v-list-tile>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <!-- Tool bar  -->
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>&copy; {{Version}}</v-toolbar-title>
      <v-toolbar-side-icon>
        <span v-if="IsMongoDown"><img src="./assets/invalid.png"></span>
        <span v-else><img src="./assets/valid.png"></span>
      </v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn id="user_email" flat v-if="theuser">{{theuser.email}}</v-btn>
        <v-btn id="register_btn" flat :disabled=IsMongoDown v-bind:to="{ name: 'Register' }" v-if="!theuser">Register</v-btn>
        <v-btn id="login_btn" flat  :disabled=IsMongoDown v-bind:to="{ name: 'Login' }" v-if="!theuser">Login</v-btn>
        <v-btn id="logout_btn" flat :disabled=IsMongoDown v-bind:to="{ name: 'Logout' }" v-if="theuser">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!--Content -->
    <v-content>
        <v-container fluid>
          <div id="app">
            <router-view/>
          </div>
        </v-container>
    </v-content>
    <!-- Footer -->
    <v-footer color="indigo" app>
      <span class="white--text">&copy; {{Version}}</span>
    </v-footer>
  </v-app>
</template>

<script>
/* eslint-disable indent */
/* eslint no-unused-vars: "off" */
/* eslint no-useless-concat: "off" */
/* eslint prefer-template: "off" */
/* eslint max-len: "off" */
/* eslint prefer-const: "off" */
/* eslint no-alert: "off" */
/* eslint no-trailing-spaces: "off" */
/* eslint brace-style: "off" */
/* eslint arrow-body-style: "off" */
/* eslint no-console: "off" */
/* eslint object-shorthand: "off" */
/* eslint func-names: "off" */
/* eslint space-before-function-paren: "off" */
/* eslint no-multi-assign: "off" */

import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

import bus from './bus';
import './assets/stylesheets/cams.css';

const myenv = require('./utilities/myenv');  
const axiosutility = require('./utilities/axiosutility');
const logger = require('./utilities/logger');
const axiosinstance = axiosutility.getAxios();

export default {
  name: "App",
  data: () => ({
    Version: 'App.vue: 1.92, Mar 17 2019 ',
    drawer: null,
    theuser: null,
    email: '',
    mongostatus: false,
    mongodown: true,
  }),
  computed: mapGetters( {
    getVersion: 'mongoStore/getVersion',
    getTime:  'mongoStore/getTime',
    getMongoStatus:  'mongoStore/getMongoStatus',
    IsMongoDown:  'mongoStore/IsMongoDown',
    getCamVersion: 'camStore/getVersion',
  }), 
  mounted() {
    this.fetchUser();
    this.listenToEvents();
    this.$store.dispatch('mongoStore/setMongoTimer');
  },
  methods: {
    // --------------------------------- Event listener --------------------------------
    listenToEvents() {
      bus.$on('refreshUser', () => {
        this.fetchUser();
      });
      bus.$on('resetUser', () => {
        this.theuser = null;
      });
    },
    // --------------------------------- Is user logged ? ------------------------------
    fetchUser() {
      return axiosinstance({
        url: '/users/whoami',
        method: 'get',
        headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
      })
      .then((response) => {
        this.theuser = response.data.whoami;
        this.email = this.theuser.email;
        this.mongostatus = response.data.mongostatus;
        logger.debug(this.Version + ':Identified user is ' + this.theuser.email); // User is not logged, err 403 received
      })
      .catch(() => { // User is not logged, HTTP 403 received
      logger.debug(this.Version + 'user is not logged');
        this.theuser = null;
      });
    },
  },

};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
