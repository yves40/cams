/*----------------------------------------------------------------------------
    mongoStore.js    

    Feb 20 2019     Initial
    Feb 21 2019     Finalize timer code
    Mar 01 2019     Mongo utils in a specific file
    Mar 05 2019     Store not working, report mongo as down : fix pb
                    Add mongodown flag
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const mongo = require('../../config/mongo');
const axiosutility = require('../../config/axiosutility');
const axiosinstance = axiosutility.getAxios();

const DOWN = 0;
const UP = 1;
const TIMEDELAYCHECK = 1000;
const MONGODELAYCHECK = 10000;

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'mongoStore:1.55, Mar 05 2019 ',
        clock: '',
        logs: [],
        logschanged: 'false',
        MAXLOG:16,
        mongostatus: DOWN,
        mongodown: true,        // TRUE if mongodb is down
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
        getMongoStatus(state) {
            return state.mongostatus===UP ? 'Mongo running': 'Mongo Down';
        },
        IsMongoDown(state) {
            return state.mongodown;
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
        updateMongoStatus(state) {  // Check mongo status every 10 seconds
            console.log(state.Version + 'Connect to : ' + mongo.getMongoDBURI());
            return axiosinstance({
                url: '/mongo/status',
                method: 'get',
              })
              .then((response) => {
                state.mongostatus = response.data.mongostatus;
                state.mongodown = response.data.mongodown;
                console.log(state.Version + 'Mongo flag is : ' + state.mongodown);
              })
              .catch(() => {
                state.mongostatus = DOWN;
                console.log(state.Version + ' Problem when enquiring mongodb status');
              });
        },
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  { // Asynchronous
        clearlog(context) {
            context.commit('clearlog');
        },
        setClockTimer(context) {
            setInterval(() => {
                context.commit('updateTime')
              }, TIMEDELAYCHECK);
        },
        setMongoTimer(context) {
            setInterval(() => {
                context.commit('updateMongoStatus')
              }, MONGODELAYCHECK);
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


