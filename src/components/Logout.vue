<!--

  Logout.vue
  
  Jan 31 2019   Initial
  Feb 06 2019   Simplify axios   
  Feb 08 2019   axiosutility...
  Mar 15 2019   Test token invalidation after logout. 
                No longer delete it from local storage
                Instead, shorten its expiration time
 
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

const myenv = require('../utilities/myenv');
const logger = require('../utilities/logger');
const axiosinstance = require('../utilities/axiosutility').getAxios();

export default {
  data: () => ({
    Version: 'Logout:1.14, Mar 17 2019 ',
  }),
  mounted() {
    this.logout();
  },
  methods: {
    // --------------------------------- Logging out  --------------------------------
    logout() {
      logger.debug(this.Version + ': Logout the user : /users/logout');
      return axiosinstance({
        url: '/users/logout',
        headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
        method: 'post',
        session: false,
      })
      .then((response) => {
        window.localStorage.setItem('jwt', response.data.token);  // Token has been invalidated by the call to /users/logout
        bus.$emit('resetUser');
        logger.debug(this.Version + ':' + response.data.message);
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
