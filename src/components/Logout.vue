<!--

  Logout.vue

  
  Jan 31 2019   Initial
  
-->
<template>

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
import bus from '../bus';

const myenv = require('../../config/myenv');  


export default {
  data: () => ({
    Version: '1.04, Jan 31 2019 ',
  }),
  mounted() {
    this.logout();
  },
  methods: {
    // --------------------------------- Logging out  --------------------------------
    logout() {
      const prefix = myenv.getURLprefix();
      this.$log.debug('Logout the user :', prefix + '/users/logout');
      // Configure axios to include a jwt header in every request
      axios.defaults.headers.authorization = 'jwt ' + window.localStorage.getItem('jwt');
      return axios({
        method: 'post',
        url: prefix + '/users/logout',
        withCredentials: 'true',
      })
      .then((response) => {
        this.$log.debug(response.data.message);
        window.localStorage.removeItem('jwt');
        bus.$emit('refreshUser');
        this.$router.push({ name: 'Home' });
      })
      .catch(() => {});
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
