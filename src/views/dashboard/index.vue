<template>
<!--  <div class="dashboard-container">-->
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
<!--  </div>-->
  <div>
    <div style="width:500px;height:500px" ref="chart"></div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// eslint-disable-next-line no-unused-vars
const echarts = require('echarts')
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      const myChart = this.$echarts.init(this.$refs.chart)
      // 绘制图表
      myChart.setOption({
        title: {text: '在Vue中使用echarts'},
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
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
</style>
