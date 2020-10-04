<template>
  <animation></animation>

  <div id="clipboard-ui-wrapper" v-if="clipboardSupported">
    <button @click="clipboardShorten">
      shorten in clipboard
    </button>
    <p>{{ msgClip }}</p>
  </div>
  <div id="form-ui-wrapper">
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
import animation from "@/components/animation.vue";
import normalizeUrl from "normalize-url";

export default {
  name: "UrlShorten",
  components: {
    animation
  },
  computed: {
    clipboardSupported: () =>
      navigator && navigator.clipboard && navigator.clipboard.readText
  },
  data() {
    return {
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
</style>
