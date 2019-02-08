//----------------------------------------------------------------------------
//    index.js
//
//    Jan 16 2019    Remove RegisterDBG
//    Jan 17 2019    WIP on user services
//    Jan 31 2019    Logout route
//----------------------------------------------------------------------------

const Version = "index.js: Jan 31 2019, 1.05 ";

import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Identity from "@/components/Identity";
import Logout from "@/components/Logout";

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
      path: '/users/logout',
      name: 'Logout',
      component: Logout,
    },
    {
      path: '/users/identity',
      name: 'Identity',
      component: Identity,
    },
  ]
});
