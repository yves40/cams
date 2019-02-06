//----------------------------------------------------------------------------
//    axiosutility.js
//
//    Feb 06 2019   Initial
//----------------------------------------------------------------------------
import axios from 'axios';
import myenv from './myenv';

const Version = 'axiosutility, Feb 06 2019';

const axiosinstance = axios.create({
  baseURL: myenv.getURLprefix(),
  timeout: 1000,
  headers: { 'authorization': 'jwt ' + window.localStorage.getItem('jwt') }
});

export default axiosinstance;

