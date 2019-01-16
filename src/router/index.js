//----------------------------------------------------------------------------
//    index.js
//
//    Jan 16 2019    Remove RegisterDBG
//----------------------------------------------------------------------------

const Version = "index.js, Jan 16 2019, 1.02 ";

import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Register from "@/components/Register";

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
      path: "/users/login",
      name: "Login",
      component: Login
    },
    {
      path: "/users/register",
      name: "Register",
      component: Register
    }
  ]
});
