<template>
  <v-container>
    <v-row class="d-flex justify-center flex-column page-container">
      <v-col class="button-container">
        <button :class="buttonActive == 0 ? 'active':''" @click="setStock(0)">Daily</button>
        <button :class="buttonActive == 1 ? 'active':''" @click="setStock(1)">Weekly</button>
        <button :class="buttonActive == 2 ? 'active':''" @click="setStock(2)">Monthly</button>
      </v-col>
      <v-col class="d-flex justify-center">
        <div id="candleChart" ref="candle"></div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import * as d3 from "d3";
export default {
  name: "Market",
  data(){
    return{
      buttonActive:0,
    }
  },
  
  created() {
    if (this.$route.params.id) {
      this.getCompanyDailyStockValues(this.$route.params.id)
      .then(()=>this.createChart())
    }
    console.log(this.$route.params.id)
  },
  computed: {
    ...mapGetters(["setDailyResultsThirty", "setDatesThirty"]),
    ...mapState(["dailyResults"]),
    
  },

  methods: {
    ...mapActions(["getCompanyDailyStockValues"]),

    setStock(val){
      this.buttonActive = val
    },

    createChart() {
      let margin = { top: 100, right: 50, bottom: 100, left: 50 };
      let width = 900;
      let height = 650;

      const svg = d3
        .select(this.$refs.candle)
        .append("svg")
        .attr("id", "chartsvg")
        .attr("width", width)
        .attr("height", height);
      svg
        .append("rect")
        .attr("id", "rect")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "white")
        .attr("stroke-width", "5px")
        .attr("fill", "#202124");

      const graphicContainer = svg
        .append("g")
        .attr("width", width - margin.left * 2)
        .attr("height", height - 100)
        .attr("fill", "transparent");

      graphicContainer
        .append("rect")
        .attr("width", width - margin.left * 2 - 15)
        .attr("height", height - 115)
        /*  .attr('fill','blue')  */
        .attr("transform", `translate(${50},${50})`);

      let highs = [];
      this.setDailyResultsThirty.forEach((item) => {
        highs.push(item["2. high"]);
      });
      let sorted = highs.sort((a, b) => b - a);

      let list = [];
      Object.keys(this.dailyResults)
        .slice(0, 30)
        .forEach((item) => {
          let obj = new Object({
            ...this.dailyResults[item],
            date: item,
          });
          list.push(obj);
        });
      console.log(highs);

      const axisX = d3
        .scaleBand()
        .domain(this.setDatesThirty.map((d) => d))
        .range([ width - 115,0]);

      svg
        .append("g") //x ekseni
        .attr("transform", `translate(${50},${height - margin.top + 35})`)
        .attr("color", "white")
        .attr("stroke-width", "3px")

        .call(d3.axisBottom(axisX))
        .selectAll("text")
        .attr("transform", "translate(-5,10)rotate(-45)")
        .style("text-anchor", "end")
        .style("color", "white");

      const axisY = d3
        .scaleLinear()
        .domain([sorted[sorted.length - 1]-20, sorted[0]])
        .range([height - 100, 15]);

      svg
        .append("g") //y ekseni
        .attr("transform", `translate(${50},${35})`)
        .call(d3.axisLeft(axisY))
        .style("color", "white")
        .attr("stroke-width", "3px")
        .attr("color", "white");

     
      graphicContainer
        .selectAll("sticks")
        .data(list)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return axisX(d.date)+(785/(d.date.length+1)-5);
        })
        .attr("y", function (d) {
          if (d["2. high"] > d["3. low"]) {
            return axisY(d["2. high"]-4);
          } else {
            return axisY(d["3. low"]-4);
          }
        })
        .attr("width", 5)
        .attr("fill", "white")
        .attr("height", (d) => Math.abs(d["2. high"] - d["3. low"]+15));

      graphicContainer
        .selectAll("candles")
        .data(list)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return axisX(d.date) + (785/(d.date.length+1))-10;
        })
        /* (d)=>{return axisY(d3.max([d['1. open'],d['4. close']]))} */
        .attr("y",(d)=>{
          if(d['1. open']>d['4. close']){
           return axisY(d['1. open']-4)
            
            
          }else{
           return axisY(d['4. close']-4)
           
          }
        })
        .attr("width", 15)
        .attr("height", (d) => Math.abs(d["1. open"] - d["4. close"]+4))
        .classed("rise", function (d) {
          return d["1. open"] < d["4. close"];
        })
        .classed("fall", function (d) {
          return d["1. open"] > d["4. close"];
        });

       

    },

    showDetail(){
      console.log('evet')
    }

   
  },

  
}
</script>
<style lang="scss">
.page-container{
  position: relative;
}
.button-container{
  display: flex;
  width: 500px;
  justify-content: space-around;
  background-color: transparent;
  position: absolute;
  top: 45px;
  left: 400px;
}
.button-container button{
  color: white;
  border: 2px solid white;
  width: 100px;
  height: 40px;
}
button.active{
  background-color: white;
  color: black;
  
}
#candleChart {
  width: 1032px;
  height: 782px;
  border: 3px solid white;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rise {
  fill: green;
}
.fall {
  fill: red;
}

</style>