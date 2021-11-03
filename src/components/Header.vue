<template>
  <v-container class="container--fluid">
    <v-row class="header" >
      <v-col class="d-flex justify-start"><span><i class="fas fa-dollar-sign"></i></span></v-col>
      <v-col class="d-flex justify-end"><span><i class="fas fa-user"></i></span></v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Header',

  }
</script>
<style scoped lang="scss">
  .header{
     background-color: #202124;
     border-bottom: 3px solid white;
    height: 100px;
    align-items: center;
    padding: 0rem 10rem;
    display: flex;
  }
  .header span{
    color: white;
  }
</style>
