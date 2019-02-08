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

-->
<template>
    <div class="grid3x5">
        <div class="header">{{Version}}</div>
        <div class="content3cols">
          <p>{{email}}</p>
        </div>
        <div class="content2cols">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit tempora, dignissimos modi perspiciatis ab ex excepturi ullam rem cum laudantium!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
        </div>
        <div class="content1col">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit tempora, dignissimos modi perspiciatis ab ex excepturi ullam rem cum laudantium!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, exercitationem?</p>
        </div>
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
const axiosinstance = require('../../config/axiosutility').getAxios();

export default {
  data: () => ({
    Version: 'Identity:1.57, Feb 08 2019 ',
    payload: '',
    theuser: null,
    email: '',
  }),
  methods: {
    // --------------------------------- Is user logged ? ------------------------------
    fetchUser() {
      this.$log.debug(this.Version + ': fetchuser /users/current_user');
      return axiosinstance({
        url: '/users/current_user',
        method: 'get',
        withCredentials: 'true',
        headers: { Authorization: 'jwt ' + window.localStorage.getItem('jwt') },
      })
      .then((response) => {
        this.theuser = response.data.current_user;
        this.email = this.theuser.email;
        this.$log.debug(this.Version + ': Identity.vue:Fetched ' + this.theuser.email);
      })
      .catch(() => {
        this.theuser = null;
        this.email = '';
        this.$log.debug(this.Version + ': fetchuser catch(), current_user set to null'); // User is not logged, err 403 received
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
