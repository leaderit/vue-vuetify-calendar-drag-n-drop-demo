<template>
<v-container>
  <v-row>
    <v-col cols=3>
      <Calendar />
    </v-col>
    <v-col cols=7>
      <Schedule />
    </v-col>
    <v-col columns=2>
      <ScheduleInfo />
    </v-col>
  </v-row>
</v-container>
</template>

<script>
  import Calendar from '@/components/Calendar'
  import Menu from '@/components/Menu'
  import Schedule from '@/components/Schedule'
  import ScheduleInfo from '@/components/ScheduleInfo'

  export default {
    name: 'Home',

    components: {
      Calendar,
      Menu,
      Schedule,
      ScheduleInfo
    },
  }
</script>
