/*----------------------------------------------------------------------------
    mongoStore.js    

    Feb 20 2019     Initial
    Feb 21 2019     Finalize timer code
    Mar 01 2019     Mongo utils in a specific file
    Mar 05 2019     Store not working, report mongo as down : fix pb
                    Add mongodown flag
    Mar 06 2019     Use logger. Not to a file, just in the console
    Mar 07 2019     Cleanup some code
    Mar 10 2019     Reduce checking delay for mongo to 2 seconds
                    Suppress unnecessary log messages
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const mongo = require('../utilities/mongo');
const logger = require('../utilities/logger');
const axiosutility = require('../utilities/axiosutility');
const axiosinstance = axiosutility.getAxios();

const DOWN = 0;
const UP = 1;
const TIMEDELAYCHECK = 1000;
const MONGODELAYCHECK = 2000;

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'mongoStore:1.61, Mar 10 2019 ',
        clock: '',
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
            return axiosinstance({
                url: '/mongo/status',
                method: 'get',
              })
              .then((response) => {
                state.mongostatus = response.data.mongostatus;
                state.mongodown = response.data.mongodown;
              })
              .catch(() => {
                state.mongostatus = DOWN;
                logger.error(state.Version + ' Problem when enquiring mongodb status');
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
}


