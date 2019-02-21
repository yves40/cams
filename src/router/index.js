//----------------------------------------------------------------------------
//    index.js
//
//    Jan 16 2019    Remove RegisterDBG
//    Jan 17 2019    WIP on user services
//    Jan 31 2019    Logout route
//    Feb 21 2019    Helloworld changed to Welcome
//----------------------------------------------------------------------------

const Version = "index.js: Feb 21 2019, 1.06 ";

import Vue from "vue";
import Router from "vue-router";
import Welcome from "@/components/Welcome";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Identity from "@/components/Identity";
import Logout from "@/components/Logout";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Welcome",
      component: Welcome
    },
    {
      path: "/",
      name: "Home",
      component: Welcome
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
