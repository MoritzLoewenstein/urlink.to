<template>
  <UrlShorten />
</template>

<script>
import UrlShorten from "./components/UrlShorten.vue";

export default {
  name: "App",
  components: {
    UrlShorten
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
