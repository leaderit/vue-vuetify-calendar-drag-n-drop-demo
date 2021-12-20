// BEGIN: Fake schedule generator
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
const names = ['Осмотр', 'Анализы', 'Консультация', 'Прием', 'Звонок', 'Онлайн консультация']

let fakeEvent = []

function rnd (a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}

function fakeEvents ( start, end, categories ) {
  const events = []

  const min = new Date(`${start.date}T00:00:00`)
  const max = new Date(`${end.date}T23:59:59`)
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)
    const client_id = rnd(1,100000)

    events.push({
      id: rnd(1,100000),
      client_id,
      client:{
        id: client_id,
        name: 'Client '+client_id 
      },
      info: 'Info about client '+client_id,
      name: names[ rnd(0, names.length - 1)],
      start: first,
      end: second,
      color: colors[ rnd(0, colors.length - 1)],
      timed: !allDay,
      category: categories[ rnd(0, categories.length - 1)].id,
    })
  }

  return events
}
// END

// initial state
const state = () => ({
  day: null,
  all: [],
  schedule: [],
  selected: null,
  names,
  colors
})

// getters
const getters = {}

// actions
const actions = {
  async fetch ({ commit }, query ) {
    let data = []

    // console.log( 'FETCH QUERY:', query )
    // Запросить данные с сервера
    data = fakeEvents( query.start, query.end, query.categories )

    commit('setSchedule', data)
  },

  async eventAdd({ commit }, data )
  {
    commit('eventAdd', data)
  },

  async eventDel({ commit }, data )
  {
    commit('eventDel', data)
  },

  setSchedule( { commit }, data )
  {
    commit('setSchedule', data)
  } ,

  setSelected( { commit }, data )
  {
    commit('setSelected', data)
  },

  setDay( { commit }, data )
  {
    commit('setDay', data)
  }  

}

// mutations
const mutations = {
  setSchedule (state, data) {
    state.schedule = data
  },

  eventAdd (state, data) {
    state.schedule.push( data )
  },

  eventDel (state, data) {
    const index = state.schedule.indexOf(data);    
    if (index > -1) state.schedule.splice(index, 1);
    // state.selected = null
  },  

  setDay( state, data )
  {
    state.day = data
  },

  setSelected( state, data )
  {
    state.selected = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}