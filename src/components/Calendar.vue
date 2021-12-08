<template>
  <v-row
    justify="space-around"
    align="center"
  >
    <v-date-picker
      v-model="picker"
      locale="ru"
      first-day-of-week=1
      no-title
    ></v-date-picker>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Calendar',

  data: () => ({
    ecosystem: [],
    picker: null,
  }),

  watch: {
    picker( newValue, oldValue ) {
      this.setDay( newValue )
    },
    day( newValue, oldValue ) {
      this.picker = newValue
    }
  },

  computed: {
    ... mapState('schedules', [ 'day' ]),
  },

  methods: {
    ...mapActions('schedules', [ 'setDay' ]),
  }
}
</script>
