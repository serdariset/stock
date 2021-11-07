<template>
  <v-container>
      <v-row class="d-flex justify-center">
          <v-col class="d-flex justify-center">
              {{pathMoves}}
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name:'Admin',
    computed: {
        ...mapState(['pathMoves'])
    }
}
</script>

<style>

</style>