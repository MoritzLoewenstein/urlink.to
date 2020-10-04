<template>
  <animation></animation>

  <div id="error-msg-wrapper">
    <p>error occured while redirecting</p>
    <router-link to="/">shorten url</router-link>
  </div>
</template>

<script>
import animation from "@/components/animation.vue";
export default {
  name: "Error",
  components: {
    animation
  },
  data() {
    return {
      errorMsg: ""
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto");

* {
  font-size: 24px;
  font-family: "Roboto", sans-serif;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#error-msg-wrapper {
  padding: 0;
  position: relative;
  margin: 5% auto 0 auto;
  width: max-content;
  max-width: 80%;
  border: 5px solid #d8dee9;
  color: #d8dee9;
  display: flex;
  flex-direction: column;
  text-align: center;

  a,
  p {
    color: #eceff4;
    border: none;
    padding: 1rem;
  }

  a {
    text-decoration: none;
    background-color: #5e81ac;
    cursor: pointer;
    transition: 0.3s all linear;
    &:active,
    &:hover {
      background-color: #4c566a;
    }
  }

  p {
    margin: 0;
    background-color: #d08770;
  }
}
</style>
