<template>
  <div ref="dashboard-chart">
    <div class="cards" style="margin-top: 50px" align="center" >
      <div style="width: 20%;display: inline-block">
        <h2>
          维修总金额: {{ this.totalAmount }}
        </h2>
      </div>
      <div style="width: 20%;display: inline-block">
        <h2>
          近一年维修金额: {{ this.totalAmountLastYear }}
        </h2>
      </div>
      <div style="width: 20%;display: inline-block">
        <h2>
          总用户数: {{ this.CountUser }}
        </h2>
      </div>
      <div style="width: 20%;display: inline-block">
        <h2>
          近一年的用户数: {{ this.CountUserLastYear }}
        </h2>
      </div>
    </div>
    <div style="margin-top: 150px">
      <div ref="AmountLastYearByMonth" style="width:45%;height:350px;display: inline-block;margin-left: 5%"></div>
      <div ref="UserLastYearByMonth" style="width:45%;height:350px;display: inline-block;margin-right: 5%"></div>
    </div>
    <div style="margin-top: 100px">
      <div ref="selectCarCountByBrandLastYear" style="width:30%;height:500px;margin-left: 5%;display: inline-block"></div>
      <div ref="selectCarNameAndCountLastYear" style="width:30%; height:500px;display: inline-block"></div>
      <div ref="selectCarCountByBrandAndNameLastMonth" style="width:30%; height:500px;display: inline-block;margin-right: 5%"></div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  selectAmountLastYearByMonth,
  selectCarCountByBrandAndNameLastMonth,
  selectCarCountByBrandLastYear,
  selectCarNameAndCountLastYear,
  selectCountUser,
  selectCountUserLastYear,
  selectTotalAmount,
  selectTotalAmountLastYear, selectUserCountLastYearByMonth
} from "@/api/dashBoard";

const echarts = require('echarts')
export default {
  name: 'Dashboard',
  data() {
    return {
      totalAmount: 0,
      totalAmountLastYear: 0,
      CountUser: 0,
      CountUserLastYear: 0,
      moneyPerMonthList: [],
      userPerMonthList: [],
      monthList: [],
      moneyList: [],
      userList: [],
      selectCarCountByBrandLastYear: [],
      selectCarCountByBrandAndNameLastMonth: [],
      selectCarNameAndCountLastYear: [],
      brandCountList: [],
      brandList: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    selectTotalAmount().then((res) => {
      this.totalAmount = res.data
    })
    selectTotalAmountLastYear().then((res) => {
      this.totalAmountLastYear = res.data
    })
    selectCountUser().then((res) => {
      this.CountUser = res.data
    })
    selectCountUserLastYear().then((res) => {
      this.CountUserLastYear = res.data
    })
    selectAmountLastYearByMonth().then((res) => {
      this.moneyPerMonthList = res.data
      this.monthList = this.moneyPerMonthList.collectMonthList
      this.moneyList = this.moneyPerMonthList.collectMoneyList
      this.initCharts()
    })
    selectUserCountLastYearByMonth().then((res) => {
      this.userPerMonthList = res.data
      this.userList = this.userPerMonthList.collectUserList
      this.initCharts()
    })
    selectCarCountByBrandLastYear().then((res) => {
      this.selectCarCountByBrandLastYear = res.data
      this.initCharts()
    })
    selectCarCountByBrandAndNameLastMonth().then((res) => {
      this.selectCarCountByBrandAndNameLastMonth = res.data
      this.initCharts()
    })
    selectCarNameAndCountLastYear().then((res) => {
      this.selectCarNameAndCountLastYear = res.data
      this.initCharts()
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  methods: {
    initCharts() {
      const myChart = echarts.init(this.$refs.AmountLastYearByMonth)
      myChart.setOption({
        title: {
          text: '近一年每月收入(元)',
          left: 'center'
        },
        xAxis: {
          data: this.monthList,
          boundaryGap: false,
          axisTick: {
            show: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            label: {
              show: true,
              position: 'top',
              valueAnimation: true
            },
            name: '金额',
            type: 'bar',
            data: this.moneyList
          }
        ]
      })
      const myChart2 = echarts.init(this.$refs.UserLastYearByMonth)
      myChart2.setOption({
        title: {
          text: '近一年每月用户数',
          left: 'center'
        },
        xAxis: {
          data: this.monthList,
          boundaryGap: false,
          axisTick: {
            show: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            label: {
              show: true,
              position: 'top',
              valueAnimation: true
            },
            name: '用户数',
            type: 'bar',
            data: this.userList
          }
        ]
      })
      const myChart3 = echarts.init(this.$refs.selectCarCountByBrandLastYear)
      myChart3.setOption({
        title: {
          text: '近一年维修车品牌和数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        // legend: {
        //   left: 'top',
        //   bottom: '10',
        //   data: this.CarBrandLastYearList
        // },
        series: [
          {
            name: '近一年维修车品牌和数量',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.selectCarCountByBrandLastYear,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
      const myChart4 = echarts.init(this.$refs.selectCarCountByBrandAndNameLastMonth)
      myChart4.setOption({
        title: {
          text: '近一个月维修车名和数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        // legend: {
        //   left: 'top',
        //   bottom: '10',
        //   data: this.CarBrandLastYearList
        // },
        series: [
          {
            name: '近一个月维修车名和数量',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.selectCarCountByBrandAndNameLastMonth,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
      const myChart5 = echarts.init(this.$refs.selectCarNameAndCountLastYear)
      myChart5.setOption({
        title: {
          text: '近一个年维修车名和数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        // legend: {
        //   left: 'top',
        //   bottom: '10',
        //   data: this.CarBrandLastYearList
        // },
        series: [
          {
            name: '近一年维修车品牌和数量',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.selectCarNameAndCountLastYear,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
      window.addEventListener("resize", () => {
        myChart.resize()
        myChart2.resize()
        myChart3.resize()
        myChart4.resize()
        myChart5.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.cards div{
  background: rgba(182, 228, 234, 0.66);
  margin: 0 20px;
  height: 100px;
  text-align: center;
  font-size: 14px;
  padding-top: 30px;
}
</style>
