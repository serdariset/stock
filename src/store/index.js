import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiURL: "https://alpha-vantage.p.rapidapi.com/query",
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": "67a042a49amsha64a877341a3cf7p1cba01jsn09fe2d6747f6",
    },
    searchResults: [],
    dailyResults: [],
    weeklyResults:[]
  },
  mutations: {
    // Set company market values by search
    SET_COMPANY_SEARCH_RESULT(state, payload) {
      state.searchResults = payload;
    },
    // Set company market values daily
    SET_COMPANY_DAILY_DETAIL(state, payload) {
      state.dailyResults = payload;
    },
    SET_COMPANY_WEEKLY_DETAIL(state,payload) {
      state.weeklyResults = payload
    }
  },
  actions: {
    // Get company markets values by search
    searchCompanyByName({ state, commit }, payload) {
      return axios
        .get(`${state.apiURL}`, {
          headers: { ...state.headers },
          params: { keywords: payload, function: "SYMBOL_SEARCH" },
        })
        .then((res) => {
         
          commit("SET_COMPANY_SEARCH_RESULT", res.data.bestMatches); //Search result gives best matches
        })
        .catch((err) => console.log(err));
    },
    // Get company daily stock values with market symbol
    getCompanyDailyStockValues({ state, commit }, payload) {
      return axios
        .get(`${state.apiURL}`, {
          headers: { ...state.headers },
          params: {
            symbol: payload,
            function: "TIME_SERIES_DAILY",
          },
        })
        .then((res) => {
          console.log(res.data)
          commit("SET_COMPANY_DAILY_DETAIL", res.data["Time Series (Daily)"]);
        });
    },
    getCompanyWeeklyStockValues({state,commit},payload){
      return axios
        .get(`${state.apiURL}`,{
          headers:{...state.headers},
          params:{
            symbol:payload,
            function: 'TIME_SERIES_WEEKLY'
          },
        })
        .then((res)=>{
          console.log(res)
          commit('SET_COMPANY_WEEKLY_DETAIL',res.data['Weekly Time Series'])
        })
    }
  },
  getters: {
    setDailyResultsThirty(state) {
      return Object.values(state.dailyResults).slice(0, 30);
    },
    setDailyDatesThirty(state) {
      return Object.keys(state.dailyResults).slice(0, 30);
    },
    setWeeklyResultsThirty(state){
      return Object.values(state.weeklyResults).slice(0,30)
    },
    setWeeklyDatesThirty(state){
      return Object.keys(state.weeklyResults).slice(0,30)
    }
  },

  modules: {},
});
