import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routeName: ""
  },
  mutations: {
    updateRouteName(state, payload) {
      state.routeName = payload;
    }
  },
  actions: {}
});
