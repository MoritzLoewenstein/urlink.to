import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ErrorView from "../views/Error.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/error",
    name: "Error",
    component: ErrorView
  },
  {
    path: "/:id",
    beforeEnter(to) {
      location.href = `${process.env.VUE_APP_API_URL}${to.fullPath}`;
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
