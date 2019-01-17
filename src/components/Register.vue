<!--

  Register.vue

  Used to register a new user on our site ;-)

  Nov 11 2018   Initial
  Nov 12 2018   Make a test with vee-validate
  Nov 15 2018   vee-validate injected
  Nov 16 2018   What's the watch API in Vue ?
  Nov 17 2018   watch callback not working
                Now working, problem with this and arrow functions
  Nov 20 2018   Manage the submit button activation
  Nov 21 2018   Submit button activation. 
                WIP on user registration persistence
  Nov 22 2018   Reduce register screen size 
  Dec 02 2018   Switching to mono node server, change target URL
  Dec 03 2018   Manage target URL depending on DEV or PROD environment
                Based on NODEURLPREFIX environment variable.
                Look at myenv.js in ./config
  Dec 07 2018   Remove style section
  Jan 01 2019   CAMS project
  Jan 02 2019   Debug vee-validate ;-(((
  Jan 17 2019   Some CORS tests

-->
<template>
  <!-- 
      The ValidationObserver is a convenient component that also uses the scoped slots feature to communicate 
      the current state of your inputs as a whole.
  -->
  <ValidationObserver>
    <div slot-scope="{ invalid, validated }">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Register User</v-toolbar-title>
      </v-toolbar>
      <v-card-title>{{Version}}</v-card-title>
      <!-- The input area -->
      <v-card-text>
        <v-form>
          <!-- Name -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider name="name" rules="required|min:4|max:20">
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="name"
                  :error-messages="errors"
                  :success="valid"
                  label="Name"
                  required
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
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
              <ValidationProvider name="password" rules="required|min:6|confirmed:passconf" vid="passwd">
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="password"
                  :error-messages="errors"
                  :success="valid"
                  label="Password"
                  type="password"
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
          <!-- Password control -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider name="passwordctl" rules="required|min:6|confirmed:passwd" vid="passconf" >
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="passwordctl"
                  :error-messages="errors"
                  :success="valid"
                  label="Password again"
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
              <v-btn color="primary" @click="submit" :disabled="invalid || !validated">Register</v-btn>
            </div>
            <div class="col"></div>
          </v-card-actions>
      </div>
    </div>
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

const myenv = require('../../config/myenv');  

export default {
  data: () => ({
    Version: '2.43, Jan 17 2019',
    name: '',
    email: '',
    password: '',
    passwordctl: '',
  }),
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    async clear() {
      this.name = this.password = this.email = this.passwordctl = '';
    },
    // All rules satisfied otherwise button is disabled
    submit() {      
      this.$log.debug('Submit called ');
      const prefix = myenv.getURLprefix();
      return axios(
        {
            method: 'post',
            data: {
                name: this.name,
                email: this.email,
                password: this.password,
            },
            url: prefix + '/users/register',
            headers: {
                'Content-Type': 'application/json',
            },
        },
      )
      .then(() => {
          this.$swal('Great!', 'User registered', 'success');
          this.$router.push({ name: 'Login' });
        },
      )
      .catch((error) => {
            const message = error.message;
            this.$swal('Damned!', `${message}`, 'error');
        },
      );
    },
  },
};
</script>
