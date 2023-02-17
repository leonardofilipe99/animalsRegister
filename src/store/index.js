import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    animals: []
  },
  getters: {},
  actions: {
    saveAnimal({ commit }, animal) {
      commit("addAnimal", animal);
    },
    deleteAnimal: ({ commit }, row) => {
      commit("DELETE_ANIMAL", row);
    },
    editAnimal({ commit }, animal) {
      commit("updateAnimal", animal);
    },
    searchAnimal({ commit }, animal) {
      commit("SEARCH_ANIMAL", animal);
    }
  },
  mutations: {
    addAnimal(state, animal) {
      if (!state.animals.find((a) => a.number === animal.number)) {
        state.animals = state.animals.concat(animal);
      }
    },
    DELETE_ANIMAL(state, animalID) {
      let animals = state.animals.filter((a) => a.number !== animalID.number);
      state.animals = animals;
    },
    updateAnimal(state, animal) {
      state.animals = [
        ...state.animals.filter((a) => a.number !== animal.number),
        animal
      ];
    },
    SEARCH_ANIMAL(state, animal) {
      const vaca = this.$store.state.animals.find((animal) => {
        return animal.number === this.number;
      });
    }
  },
  plugins: [createPersistedState()]
});
