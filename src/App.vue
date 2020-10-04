<template>
  <animation></animation>
  <router-view />
</template>

<script>
import animation from "@/components/animation.vue";
export default {
  components: {
    animation
  }
};
</script>
