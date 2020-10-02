<template>
  <div id="loading-wrapper">
    <div v-for="n in 5" :key="n" :id="`loading-screen-${n}`" />
  </div>

  <div id="clipboard-ui-wrapper" v-if="!loading && clipboardSupported">
    <button @click="clipboardShorten">
      shorten in clipboard
    </button>
    <p>{{ msgClip }}</p>
  </div>
  <div id="form-ui-wrapper" v-if="!loading">
    <input type="url" id="url" v-model="urlForm" placeholder="example.org" />
    <button @click="formShorten">
      1. shorten
    </button>
    <input
      id="msg-form"
      contenteditable="true"
      v-model="msgForm"
      placeholder="..."
    />
    <button @click="formCopy">2. copy</button>
  </div>
</template>

<script>
import normalizeUrl from "normalize-url";

export default {
  name: "UrlShorten",
  computed: {
    clipboardSupported: () =>
      navigator && navigator.clipboard && navigator.clipboard.readText
  },
  data() {
    return {
      loading: true,
      msgClip: "_",
      msgForm: "",
      urlForm: ""
    };
  },
  methods: {
    async clipboardShorten() {
      this.msgClip = "...";
      const url = await navigator.clipboard.readText();
      const normalizedUrl = normalizeUrl(url);
      if (!this.isUrlValid(normalizedUrl)) {
        this.msgClip = "❌ invalid url";
        return;
      }

      this.shorten(normalizedUrl)
        .then(shortUrl => {
          navigator.clipboard.writeText(shortUrl);
          this.msgClip = "✅";
        })
        .catch(err => {
          this.msgClip = `❌ ${err.message}`;
        });
    },
    async formShorten() {
      const normalizedUrl = normalizeUrl(this.urlForm);
      if (!this.isUrlValid(normalizedUrl)) {
        this.msgForm = `❌ invalid url`;
        return;
      }

      this.shorten(normalizedUrl)
        .then(shortUrl => (this.msgForm = shortUrl))
        .catch(err => {
          this.msgForm = `❌ ${err.message}`;
        });
    },
    formCopy() {
      const input = document.querySelector("#msg-form");
      input.select();
      document.execCommand("copy");
      this.msgForm = "✅";
    },
    shorten(url) {
      return fetch(`${process.env.VUE_APP_API_URL}/url`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ url: url })
      })
        .then(res => res.json())
        .then(resp => {
          if (resp.success) return resp.shortUrl;
          else throw Error(resp.msg);
        });
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
      this.loading = false;
      return;
    }

    const id = urlArr[1];

    fetch(`${process.env.VUE_APP_API_URL}/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) window.location.replace(res.url);
        else this.loading = false;
      })
      .catch(err => {
        console.log(err);
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

html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
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

input {
  border: none;
  border-radius: 0;
  text-align: center;
  padding: 0.5em 0;
}

#clipboard-ui-wrapper,
#form-ui-wrapper {
  position: relative;
  margin: 0 auto;
  width: max-content;
  max-width: 80%;
  background-color: #3b4252;
  border: 5px solid #d8dee9;
  color: #d8dee9;
  display: flex;
  flex-direction: column;
  text-align: center;
}

#form-ui-wrapper {
  margin-top: 2em;
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
