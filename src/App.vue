<template>
  <v-app>
   
    <Header/>
    
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'
import { mapActions } from 'vuex';

export default {
  name: 'App',
  data(){
    return{
      paths:[]
    }
  },
  components:{
    Header,
    
  },
  methods:{
    ...mapActions(['getPathMoves'])
  },

  watch:{
    $route(to,from){
      console.log(to,from)
      let date = new Date()
      let moves = [
        {"date:": `${date}`},
        {"to:":`${to.path}`},
        {"from:":`${from.path}`}

      ]
      /* this.paths.push(moves) */
      this.getPathMoves(moves)
    }
  }


};
</script>
<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>
