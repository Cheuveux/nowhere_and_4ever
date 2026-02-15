<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="app_header text-center mt-5"> 
    <h1 class="app_title text-2xl">from_nowhere_and_forever</h1>
  </div>
  
  <HelloWorld msg="from_nowhere_and_forever" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
