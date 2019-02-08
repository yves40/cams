//----------------------------------------------------------------------------
//    axiosutility.js
//
//    Feb 06 2019   Initial
//    Feb 08 2019   Initial
//----------------------------------------------------------------------------
const axios = require('axios');
const myenv = require('./myenv');

const Version = 'axiosutility:1.07, Feb 08 2019';

module.exports.getAxios = function getAxios() {
  return axios.create({
    baseURL: myenv.getURLprefix(),
    timeout: 1000,
    headers: { 'authorization': 'jwt ' + window.localStorage.getItem('jwt') }
  });  
}

module.exports.getVersion = function getVersion() {
  return Version;
};
