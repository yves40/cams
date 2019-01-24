<!--

  Identity.vue

  Nov 26 2018   Initial
  Nov 27 2018   Scan the user payload
  Dec 04 2018   display req.user
  Dec 07 2018   Remove style section
  Jan 17 2019   Imported in the CAMS project
  Jan 23 2019   Check user is logged
  Jan 24 2019   WIP on displayed information
  
-->
<template>
    <div class="grid">
        <div class="header">This is the identity page : {{Version}}</div>
        <div class="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam recusandae praesentium, quam aliquam veniam rem? Incidunt pariatur, rem quaerat ab fugit voluptatum laboriosam quis ipsam? Debitis odio recusandae sed ea corrupti maiores alias aperiam eius quasi dolorem. Cupiditate, nulla quos.</div>
        <div class="footer">This is the footer</div>
    </div>
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


import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import jwtconfig from '../../config/jwtconfig';
import myenv from '../../config/myenv';

const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.secretOrKey = jwtconfig.jwtSecret;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

export default {
  data: () => ({
    Version: '1.34, Jan 24 2019 ',
    token: '',
    payload: '',
    theuser: 'unknown',
  }),
  methods: {
    // --------------------------------- Is user logged ? ------------------------------
    fetchUser() {
      const prefix = myenv.getURLprefix();
      this.$log.debug('fetchuser service prefix is : ', prefix);
      return axios({
        method: 'get',
        url: prefix + '/users/current_user',
        withCredentials: 'true',
      })
      .then((response) => {
        if (response.data.current_user === 'anonymous') {
          this.$router.push({ name: 'Login' });
        }
        else {
          this.theuser = response.data.current_user;
        }
      })
      .catch(() => {
        this.$log.debug('fetchuser catch(), current_user set to null'); // User is not logged, err 403 received
        this.theuser = null;
      });
    },
  },
  mounted() {
    this.fetchUser();
    this.token = window.localStorage.getItem('jwt');
    if (this.token !== null) {
      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const buff = new Buffer(base64, 'base64');
      const payloadinit = buff.toString('ascii');
      this.payload = JSON.parse(payloadinit);
    }
  },
};
</script>
