//----------------------------------------------------------------------------
//    index.js
//
//    Jan 16 2019    Remove RegisterDBG
//    Jan 17 2019    WIP on user services
//----------------------------------------------------------------------------

const Version = "index.js, Jan 17 2019, 1.04 ";

import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Identity from "@/components/Identity";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/",
      name: "Home",
      component: HelloWorld
    },
    {
      path: "/users/register",
      name: "Register",
      component: Register
    },
    {
      path: '/users/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/identity',
      name: 'Identity',
      component: Identity,
    },
  ]
});
