<template>
  <div id="loading-wrapper">
    <div v-for="n in 5" :key="n" :id="`loading-screen-${n}`" />
  </div>
  <div id="shorten-ui">
    <div id="ui-inner-wrapper">
      <button v-if="!loading" @click="shorten">
        shorten in clipboard
      </button>
      <p>{{ msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "UrlShorten",
  computed: {
    clipboardSupported: () => navigator && navigator.clipboard
  },
  data() {
    return {
      loading: true,
      msg: "_"
    };
  },
  methods: {
    async shorten() {
      try {
        const url = await navigator.clipboard.readText();

        if (!this.isUrlValid(url)) {
          this.msg = `'${url}' is not a valid url`;
          return;
        }

        const resp = await fetch(`${process.env.VUE_APP_API_URL}/url`, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ url: url })
        }).then(res => res.json());

        if (!resp.success) {
          this.msg = resp.msg;
          return;
        }

        await navigator.clipboard.writeText(resp.shortUrl);
        this.msg = `Shortened '${url}' to '${resp.shortUrl}'`;
      } catch (err) {
        console.log(err);
        this.msg = "error while shortening";
      }
    },
    isUrlValid(url) {
      return (
        !!url &&
        url.match(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
        ) !== null
      );
    }
  },
  mounted() {
    const urlArr = window.location.href.split("#");
    if (urlArr.length !== 2) {
      this.loading = false;
      return;
    }

    if (urlArr[1].length !== 4) {
      this.msg = "invalid url";
      this.loading = false;
      return;
    }

    const id = urlArr[1];

    fetch(`${process.env.VUE_APP_API_URL}/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) window.location.replace(res.url);
        else {
          this.msg = "invalid url";
          this.loading = false;
        }
      })
      .catch(err => {
        console.log(err);
        this.msg = "could not reach url";
        this.loading = false;
      });
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto");

* {
  font-size: 24px;
  font-family: "Roboto", sans-serif;
}

button {
  color: #eceff4;
  background-color: #5e81ac;
  border: none;
  padding: 1rem;
  cursor: pointer;
  transition: 0.3s all linear;
  &:active,
  &:hover {
    background-color: #4c566a;
  }
}

#shorten-ui {
  position: absolute;
  top: 20%;
  left: 50%;
  z-index: 50;
}

#ui-inner-wrapper {
  position: relative;
  left: -50%;
  background-color: #3b4252;
  border: 5px solid #d8dee9;
  color: #d8dee9;
}

#loading-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

[id|="loading-screen"] {
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
  #loading-screen-#{$i} {
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
