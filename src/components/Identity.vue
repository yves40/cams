<!--

  Identity.vue

  Nov 26 2018   Initial
  Nov 27 2018   Scan the user payload
  Dec 04 2018   display req.user
  Dec 07 2018   Remove style section
  Jan 17 2019   Imported in the CAMS project
  Jan 23 2019   Check user is logged
  Jan 24 2019   WIP on displayed information
  Jan 30 2019   No longer need jwt stuff
                WIP on authorization header
  Jan 31 2019   Fix problems with login response
                axios default authorization header 
  Feb 06 2019   Simplify axios 
  Feb 08 2019   axiosutility...
  Feb 10 2019   Remove log message
  Mar 12 2019   whoami
  Mar 18 2019   More information about user stored in token
  Mar 19 2019   WIP on css grid
  Mar 20 2019   WIP on css grid
  Mar 23 2019   Some details on grid content css

-->
<!-- 
          <p>{{email}}</p><p>{{tokenstatus}}</p>
          <p>{{tokenvalidtime}}</p><p>Your login time : {{logintime}}</p>
          <p>Token: {{tokencleartext}}</p><p>Raw token : {{token}}</p>

-->

<template>
    <div class="grid2x14">
        <div class="header">
          <span>Logged User identity parameters</span>
        </div>
        <div class="grid2x14 contentcols">
          <span class="topline bottomline">User :</span>
          <span class="topline bottomline">{{email}}</span>
          <span class="bottomline">Logged at :</span>
          <span class="bottomline">{{logintime}}</span>
          <span class="bottomline"> Token expires in : </span>
          <span class="bottomline">{{tokenvalidtime}}</span>
          <span class="bottomline"></span>
          <span class="bottomline">{{tokenstatus}}</span>
          <span class="bottomline">Token :</span>
          <span class="bottomline">{{tokencleartext}}</span>
          <span class="bottomline">Raw token : </span>
          <span class="bottomline">{{token}}</span>
        </div>
        <div class="footer">&copy; {{Version}}</div>
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

const logger = require('../utilities/logger');
import myenv from '../utilities/myenv';
const axiosinstance = require('../utilities/axiosutility').getAxios();

export default {
  data: () => ({
    Version: 'Identity:1.93, Mar 23 2019 ',
    payload: '',
    email: '',
    theuser: null,
    tokencleartext: {},
    token: null,
    tokenstatus: null,
    tokenvalidtime: null,
    logintime: null,
  }),
  methods: {
    // --------------------------------- Is user logged ? ------------------------------
    fetchUser() {
      return axiosinstance({
        url: '/users/whoami',
        method: 'get',
        headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
      })
      .then((response) => {
        this.theuser = response.data.whoami;
        this.tokencleartext = response.data.userdecodedtoken;
        this.token = response.data.token;
        this.email = this.theuser.email;
        this.tokenstatus = response.data.tokenstatusString;
        this.tokenvalidtime = response.data.remainingtime;
        this.logintime = response.data.logintime;
        logger.debug(this.Version + ': User identified ' + this.theuser.email);
      })
      .catch(() => {
        this.theuser = null;
        this.email = '';
        logger.debug(this.Version + ': User not logged '); // User is not logged, err 401 received
        this.$router.push({ name: 'Login' });
      });
    },
  },
  mounted() {
    this.fetchUser();
    if (window.localStorage.getItem('jwt')) {
      const base64Url = window.localStorage.getItem('jwt').split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const buff = new Buffer(base64, 'base64');
      const payloadinit = buff.toString('ascii');
      this.payload = JSON.parse(payloadinit);
    }
  },
};
</script>
