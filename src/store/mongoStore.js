/*----------------------------------------------------------------------------
    mongoStore.js    

    Feb 20 2019     Initial
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

Vue.use(Vuex);

function timeClock(state) {
    state.clock = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'mongoStore:1.30, Feb 21 2019 ',
        clock: '',
        logs: [],
        logschanged: 'false',
        MAXLOG:16,
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
    },
    /*----------------------------------------------------------------------------
        Utilities
    ----------------------------------------------------------------------------*/
    // Add a message to the log table
    months: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    log: (mess) => {
        let d = new Date();
        if (state.logs.length === state.MAXLOG) {
            state.logs.shift();
        }
        state.logs.push({ 
                date: months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
                                + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"), 
                message: id + ' ' + mess });
        state.logschanged = true;
    },
}


