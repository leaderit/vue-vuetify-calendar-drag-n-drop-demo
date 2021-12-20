<template>
<v-menu
  bottom
  left
>
  <template v-slot:activator="{ on, attrs }">
    <v-btn
      dark
      icon
      v-bind="attrs"
      v-on="on"
      width="15"
      height="18"
    >
      <v-icon x-small >mdi-dots-vertical</v-icon>
    </v-btn>
  </template>

  <v-list>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      @click="onClick(item)"
    >
      <v-list-item-icon>
        <v-icon v-text="item.icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</v-menu>
</template>

<script>
  export default {
    props: {
      data: Object,
      items: Array
    },

    data: () => ({
    }),

    methods: {
      onClick(item) {
        this.$emit('context-menu', { obj: this.data, command: item } )
      }
    }

  }
</script>
