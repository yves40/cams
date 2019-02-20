<!--
  HelloWorld.vue

  Dec 31 2018   Initial
  Feb 20 2019   use this Vue to refresh Vuex knowledge ;-)

-->
<template>
  <v-content>
    Hello from {{Version}}, Happy to see you<v-spacer></v-spacer>
    {{msg}}
    <p class="time">Time is  @ {{getTime}}</p>    
  </v-content>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HelloWorld',
  data () {
    return {
      Version: 'HelloWorld 1.04: Feb 20 2019',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: mapGetters( [ 'getVersion', 'getTime'] ),
  methods: 
    mapActions([
      'clearlog',
    ]),

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
