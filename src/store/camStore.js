/*----------------------------------------------------------------------------
    camStore.js    

    Feb 20 2019     Initial
    Feb 21 2019     Finalize timer code
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'camStore:1.00, Feb 21 2019 ',
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
            console.log(context.state.Version + 'action settimer');
        },
    },}


