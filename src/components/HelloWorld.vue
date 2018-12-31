<!--
  HelloWorld.vue

  Dec 31 2018   Initial

-->
<template>
  <v-content>
    Hello from {{Version}}, Happy to see you<v-spacer></v-spacer>
    {{msg}}
  </v-content>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      Version: 'HelloWorld 1.03, Dec 21 2018',
      msg: 'Welcome to Your Vue.js App'
    }
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
</style>
