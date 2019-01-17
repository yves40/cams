<!--

  Identity.vue

  Nov 26 2018   Initial
  Nov 27 2018   Scan the user payload
  Dec 04 2018   display req.user
  Dec 07 2018   Remove style section
  Jan 17 2019   Imported in the CAMS project
  
-->
<template>
  <v-layout>
    This is the identity page : {{Version}}
    <br>
    The user token is : {{token}}
    <br>
    Payload           : {{payload}}

  </v-layout>
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
import jwtconfig from '../../config/jwtconfig';

const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {};
jwtOptions.secretOrKey = jwtconfig.jwtSecret;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

export default {
  data: () => ({
    Version: '1.27, Jan 17 2019 ',
    token: '',
    payload: '',
    theuser: 'unknown',
  }),
  methods: {
  },
  mounted() {
    this.token = window.localStorage.getItem('jwt');
    const base64Url = this.token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    this.payload = JSON.parse(payloadinit);
  },
};
</script>
