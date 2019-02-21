/*----------------------------------------------------------------------------
    mongoStore.js    

    Feb 20 2019     Initial
    Feb 21 2019     Finalize timer code
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const mongoose = require('mongoose');
const myenv = require('../../config/myenv');
const axiosutility = require('../../config/axiosutility');
const axiosinstance = axiosutility.getAxios();

const DOWN = false;
const UP = true;
const TIMEDELAYCHECK = 1000;
const MONGODELAYCHECK = 15000;

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'mongoStore:1.45, Feb 21 2019 ',
        clock: '',
        logs: [],
        logschanged: 'false',
        MAXLOG:16,
        mongostatus: DOWN,
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
            console.log(state.Version + 'Connect to : ' + myenv.getMongoDBURI());
            return axiosinstance({
                url: '/mongo/status',
                method: 'get',
              })
              .then((response) => {
                state.mongostatus = response.data.mongostatus;
                console.log(state.Version + (state.mongostatus===UP ? 'Mongo running': 'Mongo Down'));
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


