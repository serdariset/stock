<template>
  <v-container>
    <v-row class="d-flex justify-center flex-column page-container">
      <v-col class="button-container">
        <button
          :class="buttonActive == 0 ? 'active' : ''"
          @click="setStock(0, 'daily')"
        >
          Daily
        </button>
        <button
          :class="buttonActive == 1 ? 'active' : ''"
          @click="setStock(1, 'weekly')"
        >
          Weekly
        </button>
        <button
          :class="buttonActive == 2 ? 'active' : ''"
          @click="setStock(2, 'monthly')"
        >
          Monthly
        </button>
      </v-col>
      <v-col class="d-flex justify-center">
        <div id="candleChart" ref="candle"></div>
      </v-col>
    </v-row>
    {{ dates }}
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import * as d3 from "d3";
export default {
  name: "Market",
  data() {
    return {
      buttonActive: 0,
      marketMoment: "daily",
      dates: [],
      result: [],
      moment: [],
    };
  },

  created() { //draws the graph by default with daily data when the page is created
    if (this.$route.params.id) {
      this.getCompanyDailyStockValues(this.$route.params.id).then(() => {
        this.dates = this.setDailyDatesThirty;
        this.result = this.setDailyResultsThirty;
        this.moment = this.dailyResults;
        this.createChart();
      });
    }
  },
  computed: { // Gets edited datas
    ...mapGetters([
      "setDailyResultsThirty",
      "setDailyDatesThirty",
      "setWeeklyResultsThirty",
      "setWeeklyDatesThirty",
      "setMontlyDatesThirty",
      "setMonthlyResultsThirty"
    ]),
    ...mapState(["dailyResults", "weeklyResults","monthlyResults"]),
  },

  methods: { // Sends API requests
    ...mapActions([
      "getCompanyDailyStockValues",
      "getCompanyWeeklyStockValues",
      "getCompanyMonthlyStockValues"
    ]),

    setStock(val, moment) { // Changes daily, weekly or monthly data
      this.buttonActive = val;
      let symbol = this.$route.params.id;
      if (val == 0) { //Daily
        this.$router
          .push({ path: `/market/symbol/${symbol}/${moment}` })
          .then(() => {
            this.dates = this.setDailyDatesThirty;
            this.result = this.setDailyResultsThirty;
            this.moment = this.dailyResults;
            let area = this.$refs.candle;
            area.innerHTML = "";
            this.createChart();
          });
      }
      if (val == 1) { //Weekly
        this.$router.push({ path: `/market/symbol/${symbol}/${moment}` });
        this.getCompanyWeeklyStockValues(this.$route.params.id).then(() => {
          this.dates = this.setWeeklyDatesThirty;
          this.result = this.setWeeklyResultsThirty;
          this.moment = this.weeklyResults;
          let area = this.$refs.candle;
          area.innerHTML = "";
          this.createChart();
        });
      }

      if (val == 2) { //Montly
        this.$router.push({ path: `/market/symbol/${symbol}/${moment}` });
        this.getCompanyMonthlyStockValues(this.$route.params.id).then(() => {
          this.dates = this.setMontlyDatesThirty;
          this.result = this.setMonthlyResultsThirty;
          this.moment = this.monthlyResults;
          let area = this.$refs.candle;
          area.innerHTML = "";
          this.createChart();
        });
      }
      console.log(moment);
    },

    createChart() { // Draws graph
      let margin = { top: 100, right: 50, bottom: 100, left: 50 };
      let width = 900;
      let height = 650;

      const svg = d3 // Draws graph main
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

      const graphicContainer = svg // Candlestick container
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

      let highs = []; // Sort the highest and lowest values
      this.result.forEach((item) => {
        highs.push(item["2. high"]);
      });
      let sorted = highs.sort((a, b) => b - a);

      let list = []; // Edits the data of the selected time period
      Object.keys(this.moment)
        .slice(0, 30)
        .forEach((item) => {
          let obj = new Object({
            ...this.moment[item],
            date: item,
          });
          list.push(obj);
        });
      console.log(highs);

      const axisX = d3 // Draws Axis X
        .scaleBand()
        .domain(this.dates.map((d) => d))
        .range([width - 115, 0]);

      svg
        .append("g") 
        .attr("transform", `translate(${50},${height - margin.top + 35})`)
        .attr("color", "white")
        .attr("stroke-width", "3px")

        .call(d3.axisBottom(axisX))
        .selectAll("text")
        .attr("transform", "translate(-5,10)rotate(-45)")
        .style("text-anchor", "end")
        .style("color", "white");

      const axisY = d3 // Draws Axis Y
        .scaleLinear()
        .domain([sorted[sorted.length - 1] - 20, sorted[0]])
        .range([height - 100, 15]);

      svg
        .append("g") //y ekseni
        .attr("transform", `translate(${50},${35})`)
        .call(d3.axisLeft(axisY))
        .style("color", "white")
        .attr("stroke-width", "3px")
        .attr("color", "white");

      graphicContainer // Draws thin lines
        .selectAll("sticks")
        .data(list)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return axisX(d.date) + (785 / (d.date.length + 1) - 5);
        })
        .attr("y", function (d) {
          if (d["2. high"] > d["3. low"]) {
            return axisY(d["2. high"] - 4);
          } else {
            return axisY(d["3. low"] - 4);
          }
        })
        .attr("width", 5)
        .attr("fill", "white")
        .attr("height", (d) => Math.abs(d["2. high"] - d["3. low"] + 15));

      graphicContainer // Draws candles
        .selectAll("candles")
        .data(list)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return axisX(d.date) + 785 / (d.date.length + 1) - 10;
        })
        .attr("y", (d) => {
          if (d["1. open"] > d["4. close"]) {
            return axisY(d["1. open"] - 4);
          } else {
            return axisY(d["4. close"] - 4);
          }
        })
        .attr("width", 15)
        .attr("height", (d) => Math.abs(d["1. open"] - d["4. close"] + 4))
        .classed("rise", function (d) {
          return d["1. open"] < d["4. close"];
        })
        .classed("fall", function (d) {
          return d["1. open"] > d["4. close"];
        });
    },

    showDetail() {
      console.log("evet");
    },
  },
};
</script>
<style lang="scss">
.page-container {
  position: relative;
}
.button-container {
  display: flex;
  width: 500px;
  justify-content: space-around;
  background-color: transparent;
  position: absolute;
  top: 45px;
  left: 400px;
}
.button-container button {
  color: white;
  border: 2px solid white;
  width: 100px;
  height: 40px;
}
button.active {
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