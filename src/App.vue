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

export default {
  name: 'App',
  components:{
    Header,
    
  },

  watch:{
    $route(to,from){
      console.log(to,from)
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
