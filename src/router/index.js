import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import RegisterDBG from '@/components/RegisterDBG'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'Home',
      component: HelloWorld
    },
    {
      path: '/users/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/users/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/users/registerDBG',
      name: 'RegisterDBG',
      component: RegisterDBG
    },
  ]
})
