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
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn id="user_email" flat v-if="current_user">{{current_user.email}}</v-btn>
        <v-btn id="register_btn" flat v-bind:to="{ name: 'Register' }" v-if="!current_user">Register</v-btn>
        <v-btn id="login_btn" flat v-bind:to="{ name: 'Login' }" v-if="!current_user">Login</v-btn>
        <v-btn id="logout_btn" flat v-bind:to="{ name: 'Logout' }" v-if="current_user">Logout</v-btn>
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

import bus from './bus';
import './assets/stylesheets/cams.css';

const myenv = require('../config/myenv');  
const axiosinstance = require('../config/axiosutility').getAxios();

export default {
  name: "App",
  data: () => ({
    Version: 'Cams 1.39:Feb 08 2019 ',
    drawer: null,
    current_user: null,
  }),
  mounted() {
    this.fetchUser();
    this.listenToEvents();
  },
  methods: {
    // --------------------------------- Event listener --------------------------------
    listenToEvents() {
      bus.$on('refreshUser', () => {
        this.fetchUser();
      });
    },
    // --------------------------------- Is user logged ? ------------------------------
    fetchUser() {
      this.$log.debug('fetchuser on /users/current_user');
      return axiosinstance({
        url: '/users/current_user',
        method: 'get',
      })
      .then((response) => {
        this.current_user = response.data.current_user;
      })
      .catch(() => {
        this.$log.debug('fetchuser catch(), current_user set to null'); // User is not logged, err 403 received
        this.current_user = null;
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
