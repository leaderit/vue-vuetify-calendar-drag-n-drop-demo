<template>
<div>
  <div>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Сегодня
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          locale="ru"
          ref="calendar"
          v-model="focus"
          color="primary"
          type="category"
          category-show-all
          :categories="categories"
          :events="events"
          :event-color="getEventColor"
          :event-ripple="false"
          @change="fetchEvents"
          @click:event="clickEvent"
          @mousedown:event="startDrag"
          @mousedown:time-category="startTime"
          @mousemove:time-category="mouseMove"
          @mouseup:time-category="endDrag"
          @mouseleave.native="cancelDrag"
        >
          <template v-slot:event="{ event, timed, eventSummary }">
            <div>
              <div
                class="v-event-draggable"
                v-html="eventSummary()"
              >
              <br><br>
              </div>
              <div
                v-if="timed"
                class="v-event-drag-bottom"
                @mousedown.stop="extendBottom(event)"
              >
              </div>
              <div v-if="false">
              <v-btn
                fab
                dark
                x-small
                color="green"
                @click="event_edit( event )"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                x-small
                color="red"
                @click="event_delete( event )"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              </div>                       
            </div>
          </template>
          
          <!-- ШАПКА С ФОТО -->
          <template v-slot:category="obj">
            <v-card class="mx-auto">
              <v-card-title class="justify-center">
                <v-avatar size="50px">
                  <img
                    v-if="workers[obj.category].img"
                    :src="'/pic/'+workers[obj.category].img"
                  />
                  <v-icon v-else>mdi-account</v-icon>
                </v-avatar>
                <br>
              {{ workers[obj.category].name }}
              </v-card-title>
            <v-card-subtitle class="pb-0 text-center">
              {{ workers[obj.category].descr }}
            </v-card-subtitle>
            </v-card>
          </template>   
           
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
  </div>
  <div>
    <v-overlay
    opacity="0.5"
    z-index="5"
    absolute=""
    :value="edit"
    >
    <ScheduleForm
    :eventData="e"
    v-on:edit-cancel="event_edit_cancel"
    v-on:edit-save="event_edit_save"
    ></ScheduleForm>
    </v-overlay>
  </div>
</div>
</template>

<script>
import ScheduleForm from '@/components/ScheduleForm'
import { mapState, mapActions } from 'vuex'


export default {
  components: {
    ScheduleForm
  },  
  data: () => ({   
    focus: '',
    events: [],
    e: null,
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null, 
    edit: false,     
  }),

  watch: {
    focus( newValue, oldValue ) {
      this.setDay( newValue )
    },
    
    day( newValue, oldValue ) {
      this.focus = newValue
    },

  },
  computed: {
    ... mapState('schedules', [ 'day', 'schedule', 'names', 'colors' ]),
    ... mapState('workers', {
      workers: 'workers', 
      categories: 'groups'
    }),
  },

  async mounted () {
    this.$refs.calendar.checkChange()
    await this.fetchWorkers()
  },

  methods: {
    ...mapActions('schedules', {
      setDay: 'setDay',
      fetchSchedule: 'fetch',
      eventAdd: 'eventAdd',
      setSelected: 'setSelected'
    }),

    ...mapActions('workers', {
      fetchWorkers: 'fetch'
    }),

    event_edit( e ){
      this.e = e
      this.edit = true
    },

    event_edit_cancel()
    {
      this.edit = false
    },

    async event_edit_save( e )
    {
      await this.setSelected( e )
      this.edit = false
    },

    event_delete( e ){
      console.log('del', e)
    },

    getEventColor (event) {
      return event.color
    },

    setToday () {
      this.focus = ''
      this.setDay( null )
    },

    prev () {
      this.$refs.calendar.prev()
    },

    next () {
      this.$refs.calendar.next()
    },

    async fetchEvents ({ start, end }) {
      // console.log('fetch events')
      await this.fetchWorkers()
      await this.fetchSchedule( { start, end, categories: this.categories } )

      this.events = this.schedule
    },

    clickEvent( { event })
    {
      this.setSelected( event )
    },

    startDrag ({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },

    startTime (tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start
        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        this.createEvent = {
          name: `Event #${this.events.length}`,
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.createStart,
          timed: true,
          client: null,
          info:'',
          category: tms.category,
        }
        this.eventAdd( this.createEvent )
        this.events = this.schedule
      }
    },
    
    extendBottom (event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },

    mouseMove (tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start
        const end = this.dragEvent.end
        const duration = end - start
        const newStartTime = mouse - this.dragTime
        const newStart = this.roundTime(newStartTime)
        const newEnd = newStart + duration

        this.dragEvent.start = newStart
        this.dragEvent.end = newEnd
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false)
        const min = Math.min(mouseRounded, this.createStart)
        const max = Math.max(mouseRounded, this.createStart)

        this.createEvent.start = min
        this.createEvent.end = max
      }
    },

    endDrag () {
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
    },

    cancelDrag () {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          const i = this.events.indexOf(this.createEvent)
          if (i !== -1) {
            this.events.splice(i, 1)
          }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },

    roundTime (time, down = true) {
      const roundTo = 30 // minutes
      const roundDownTime = roundTo * 60 * 1000 

      return down
        ? time - time % roundDownTime
        : time + (roundDownTime - (time % roundDownTime))
    },

    toTime (tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },

    getEventColor (event) {
      const rgb = parseInt(event.color.substring(1), 16)
      const r = (rgb >> 16) & 0xFF
      const g = (rgb >> 8) & 0xFF
      const b = (rgb >> 0) & 0xFF

      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
          ? `rgba(${r}, ${g}, ${b}, 0.7)`
          : event.color
    },

    getEvents ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`).getTime()
      const max = new Date(`${end.date}T23:59:59`).getTime()
      const days = (max - min) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const timed = this.rnd(0, 3) !== 0
        const firstTimestamp = this.rnd(min, max)
        const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000
        const start = firstTimestamp - (firstTimestamp % 900000)
        const end = start + secondTimestamp

        events.push({
          name: this.rndElement(this.names),
          color: this.rndElement(this.colors),
          start,
          end,
          timed,
        })
      }

      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    rndElement (arr) {
        return arr[this.rnd(0, arr.length - 1)]
    },
  },
}
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}
</style>
