/*----------------------------------------------------------------------------
    store.js    

    Feb 20 2019     Initial
----------------------------------------------------------------------------*/

import Vue from 'vue'
import Vuex from 'vuex'

import mongoStore from './mongoStore'
import camStore from './camStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mongoStore,
    camStore,
  }
})
