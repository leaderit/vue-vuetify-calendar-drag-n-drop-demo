<template>
<v-card
  light
  md="2"
>
<v-card-title>
  Изменить событие
</v-card-title>
  <v-card-text>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-text-field
            v-model="e.name"
            :rules="nameRules"
            :counter="100"
            label="Событие"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="12"
        >
          <v-text-field
            v-model="e.info"
            :rules="nameRules"
            :counter="100"
            label="Информация"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >

        </v-col>
      </v-row>
      <v-row>

      </v-row>
    </v-container>
  </v-form>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
      <v-btn
        color="orange"
        text
        @click="$emit('edit-cancel')"
      >
        ОТМЕНА
      </v-btn>

      <v-btn
        @click="save()"
        color="orange"
        text
      >
        СОХРАНИТЬ
      </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

  export default {
    props: {
      eventData: Object
    },

    data: () => ({
      e: {
        name:'',
        info:''
      },

      valid: false,
      firstname: '',
      lastname: '',

      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 100 || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }),

    computed: {
      ... mapState('schedules', [ 'names', 'colors' ]),
    },
    
    watch: {
      eventData( newValue ) {
        console.log('new.e', newValue)
        this.e = newValue
      },
    },

    mounted() {
      this.e = this.eventData
    },

    methods: {
      save() {
        this.$emit('edit-save', this.e )
      }
    }
  }
</script>
