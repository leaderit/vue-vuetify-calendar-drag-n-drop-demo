import Vue from 'vue'
import Vuex from 'vuex'

import clients from './modules/clients'
import workers from './modules/workers'
import schedules from './modules/schedules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    workers,
    clients,
    schedules
  }
})
