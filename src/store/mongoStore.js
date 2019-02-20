/*----------------------------------------------------------------------------
    mongoStore.js    

    Feb 20 2019     Initial
----------------------------------------------------------------------------*/
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const timerID = setInterval(timeClock, 1000);

const state = {
    Version: 'mongoStore:1.02, Feb 20 2019',
    clock: new Date().toTimeString(),
    logs: [],
    logschanged: 'false',
    MAXLOG:16,
};

/*----------------------------------------------------------------------------
    U T I L I T I E S
----------------------------------------------------------------------------*/
// Display a clock
function timeClock() {
    state.clock = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
// Add a message to the log table
const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
function log(mess) {
    let d = new Date();
    if (state.logs.length === state.MAXLOG) {
        state.logs.shift();
    }
    state.logs.push({ 
            date: months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
                            + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"), 
            message: id + ' ' + mess });
    state.logschanged = true;
}
/*----------------------------------------------------------------------------
    VUEX Getters
----------------------------------------------------------------------------*/
const getters = {
    getVersion(state) {
        return 'mongoStore version is : ' + state.Version;
    },
    getTime(state) {
        return state.clock;
    },
};
/*----------------------------------------------------------------------------
    VUEX mutations
----------------------------------------------------------------------------*/
const mutations = { // Synchronous
    clearlog(state) {
        state.logs = [];
    },
};
/*----------------------------------------------------------------------------
    VUEX actions
----------------------------------------------------------------------------*/
const actions = { // Asynchronous
    clearlog(context) {
        context.commit('clearlog');
    },
};

export const store = new Vuex.Store({
        state,
        getters,
        mutations,
        actions,
    }
);

