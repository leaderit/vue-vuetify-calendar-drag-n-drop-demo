<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Calendar from '@/components/Calendar'
import Menu from '@/components/Menu'
import ScheduleInfo from '@/components/ScheduleInfo'
import ScheduleForm from '@/components/ScheduleForm'

export default {
  name: 'App',
  components: {
    Calendar,
    Menu,
    ScheduleInfo,
    ScheduleForm
  },
  data: () => ({
    //
  }),
};
</script>
