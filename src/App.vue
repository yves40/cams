<!--
  App.vue

  Dec 31 2018   Initial
  Jan 01 2019   Test&fix vee-validate problem

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
        <v-btn id="registerDBG_btn" flat v-bind:to="{ name: 'RegisterDBG' }" v-if="!current_user">Register DBG</v-btn>
        <v-btn id="login_btn" flat v-bind:to="{ name: 'Login' }" v-if="!current_user">Login</v-btn>
        <v-btn id="logout_btn" flat @click="logout" v-if="current_user">Logout</v-btn>
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
export default {
  name: "App",
  data: () => ({
    Version: 'Cams 1.13, Jan 01 2019 ',
    drawer: null,
    current_user: null,
  })
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
