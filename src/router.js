import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Demo1 from "./views/Demo1.vue";
import Demo2 from "./views/Demo2.vue";
import Demo3 from "./views/Demo3.vue";
import Demo4 from "./views/Demo4.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/Demo1",
      name: "Demo1",
      component: Demo1
    },
    {
      path: "/Demo2",
      name: "Demo2",
      component: Demo2
    },
    {
      path: "/Demo3",
      name: "Demo3",
      component: Demo3
    },
    {
      path: "/Demo4",
      name: "Demo4",
      component: Demo4
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
