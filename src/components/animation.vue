<template>
  <div id="animation-wrapper">
    <div v-for="n in 5" :key="n" :id="`animation-screen-${n}`" />
  </div>
</template>

<script>
export default {
  name: "animation"
};
</script>

<style lang="scss" scoped>
#animation-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

[id|="animation-screen"] {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

$colors: #b48ead, #a3be8c, #5e81ac, #3b4252, #ebcb8b, #a3be8c, #b48ead, #4c566a,
  #d08770, #81a1c1;

@for $i from 1 through 5 {
  $color: nth($colors, $i);
  $rot: random(4) * 90;
  #animation-screen-#{$i} {
    background-color: $color;
    transform: rotate(#{$rot}deg);
    animation: turn-#{$i}
      unquote(18 + random(5) + "s")
      linear
      unquote(random(3) / 10 + "s")
      infinite;
  }

  @keyframes turn-#{$i} {
    100% {
      transform: rotate(#{($rot + 180) % 360}deg);
    }
  }
}
</style>
