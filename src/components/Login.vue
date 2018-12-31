<!--

  Login.vue

  Used to log a user on our site ;-)

  Nov 22 2018   Initial
  Nov 25 2018   Add jwt to local storage
  Dec 02 2018   Switching to mono node server, change target URL
  Dec 03 2018   Manage target URL depending on DEV or PROD environment
                Based on NODEURLPREFIX environment variable.
                Look at myenv.js in ./config
  Dec 04 2018   Remove token write in local storage after switching to local AUTH
  Dec 06 2018   Debugging CORS user session
  Dec 07 2018   Problem with mono node config and CORS
  Dec 08 2018   TWITTER login, start of work
  Dec 09 2018   TWITTER login, work..
  Dec 31 2018   Integrated in cams project : Simplified no twitter, google or linkedin
-->
<template>

  <ValidationObserver>
    <form slot-scope="{ invalid, validated }">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Login User</v-toolbar-title>
      </v-toolbar>
      <v-card-title>{{Version}}</v-card-title>
      <!-- The input area -->
      <v-card-text>
        <v-form>
          <!-- Mail -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider name="email" rules="required|email">
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="email"
                  :error-messages="errors"
                  :success="valid"
                  label="E-mail"
                  required
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
          <!-- Password -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider name="password" rules="required">
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="password"
                  :error-messages="errors"
                  :success="valid"
                  label="Password"
                  required
                  type="password"
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
        </v-form>
      </v-card-text>
      <!-- Buttons -->
      <div class="row">
          <v-card-actions>
            <div class="col"></div>
            <div class="col">
              <v-btn  @click="clear">Clear</v-btn>
            </div>
            <div class="col">
              <v-btn color="primary" @click="submit" :disabled="invalid || !validated">Login</v-btn>
            </div>
            <div class="col"></div>
          </v-card-actions>
      </div>
    </form>
  </ValidationObserver>
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


import { ValidationObserver, ValidationProvider } from 'vee-validate';
import axios from 'axios';
// import bus from '../bus';

const myenv = require('../../config/myenv');  


export default {
  data: () => ({
    Version: '1.29, Dec 31 2018',
    email: '',
    password: '',
  }),
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    async clear() {
      this.password = this.email = '';
    },
    // All rules satisfied otherwise button is disabled
    submit() {      
      this.$log.debug('Login request called ');
      const prefix = myenv.getURLprefix();
      return axios(
        {
            method: 'post',
            data: {
                email: this.email,
                password: this.password,
            },
            url: prefix + '/users/login',
            withCredentials: 'true',
        },
      )
      .then((response) => {
          window.localStorage.setItem('jwt', response.data.token);
          this.$swal('Great!', 'Welcome ' + response.data.message, 'success');
          // bus.$emit('refreshUser');
          this.$router.push({ name: 'Identity' });
        },
      )
      .catch((error) => {
          // const errormess = req.flash('error');
          this.$swal('Damned, not logged!', 'Invalid credentials', 'error');
          this.$router.push({ name: 'Login' });
        },
      );
    },
  },
};
</script>

<style>
  h1 {
    text-align: left;
    font-family: 'Courier New', Courier, monospace;
    font-size: 2em;
  }
  h2 {
    text-align: left;
    color: blue;
    font-size:1em;
  }
</style>
