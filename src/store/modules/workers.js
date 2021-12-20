const fakeWorkers = [
  {
    id:'ae35d075-f17d-4536-bd34-86267d82ac53',
    img:'10-face.jpg',
    name:'Иванов Иван',
    descr:'стоматолог'
  }, 
  {
    id:'b065cbf8-4c60-4b5e-b272-c81cae100e26',    
    img: null,        
    name:'Петров Петр',
    descr:'ортопед'
  }, 
  {
    id:'cc7ce766-ecf4-4ad8-9328-c313ffbe51b5',    
    img: '3-face.jpg',        
    name:'Сидоров Сидор',
    descr:'хирург'
  }, 
  {
    id:'309aae6f-2075-468c-b164-f386584d544b',    
    img:'2-face.jpg',        
    name:'Иванова Мария',
    descr:'окулист'
  }  
]

// initial state
const state = () => ({
  workers: [],
})

// getters
const getters = {}

// actions
const actions = {
  async fetch ({ commit }) {
    commit('setWorkers', fakeWorkers)
  }
}

// mutations
const mutations = {
  setWorkers (state, data) {
    state.workers = data
  }, 
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}