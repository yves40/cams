/*----------------------------------------------------------------------------
    camStore.js    

    Feb 20 2019   Initial
    Feb 21 2019   Finalize timer code
    Mar 06 2019   console.log replaced by logger
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../utilities/logger');

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'camStore:1.02, Mar 06 2019 ',
        clock: '',
    },
    /*----------------------------------------------------------------------------
        VUEX Getters
    ----------------------------------------------------------------------------*/
    getters: {
        getVersion(state) {
            return state.Version;
        },
        getTime(state) {
            return state.clock;
        },
    },
    /*----------------------------------------------------------------------------
        VUEX mutations
    ----------------------------------------------------------------------------*/
    mutations: { // Synchronous
        clearlog(state) {
            state.logs = [];
        },
        updateTime(state) {
            state.clock = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        },
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  { // Asynchronous
        clearlog(context) {
            context.commit('clearlog');
        },
        settimer(context) {
            setInterval(() => {
                context.commit('updateTime')
              }, 1000);
            logger.debug(context.state.Version + 'action settimer');
        },
    },}


