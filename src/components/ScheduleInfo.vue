<template>
<v-card
    class="mx-auto"
  >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Информация
          </v-list-item-title>
          <v-list-item-subtitle>
            детали
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Menu',

  data: () => ({
    items: [
      { title: 'Услуга', icon: 'mdi-view-dashboard' },
      { title: 'Клиент', icon: 'mdi-image' },
      { title: 'Информация', icon: 'mdi-help-box' },
    ],
    right: null,      
  }),
  computed: {
    ... mapState('schedules', [ 'selected' ]),  
  },
  watch: {
    selected( v ) {
      this.items[0].title = v.name
      if ( v.client ) {
        this.items[1].title = v.client.name
        this.items[2].title = v.info 
      } else {
        this.items[1].title = ''
        this.items[2].title = ''
      }
    },
  },
}
</script>
