<!--
  Welcome.vue

  Dec 31 2018   Initial
  Feb 20 2019   use this Vue to refresh Vuex knowledge ;-)
  Feb 21 2019   Renamed : More tests with the store
  Feb 21 2019   More tests with the store
  Mar 05 2019   mongodown flag added 

-->
<template>
  <v-content>
    @ {{Version}}, Happy to see you<v-spacer></v-spacer>
    <p class="time">Time is  @ {{getTime}}</p>    
    <p>@ {{getVersion}}</p>    
    <p>@ {{getCamVersion}}</p>    
    <p>@ {{getMongoStatus}}</p>    
    <p>IsMongoDown() @ {{IsMongoDown}}</p>    
  </v-content>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Welcome',
  data () {
    return {
      Version: 'Welcome: 1.18, Feb 05 2019',
    }
  },
  computed: mapGetters( {
    getVersion: 'mongoStore/getVersion',
    getTime:  'mongoStore/getTime',
    getMongoStatus:  'mongoStore/getMongoStatus',
    IsMongoDown:  'mongoStore/IsMongoDown',
    getCamVersion: 'camStore/getVersion',
  }), 
  methods: 
    mapActions([
      'clearlog',
    ]),
  mounted() {   // Start the clock timer 
    this.$store.dispatch('mongoStore/setClockTimer');
    this.$store.dispatch('mongoStore/setMongoTimer');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.time {
    letter-spacing: 0.05em;
    font-size: 30px;
    padding: 5px 0;
}

</style>
