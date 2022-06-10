<template>
  <div class="app-container">
    <el-input v-model="queryParams.job_name" placeholder="姓名" clearable style="width: 200px;" class="filter-item"
              @keyup.enter.native="handleFilter" @clear="getList"/>
    <el-input v-model="queryParams.project_name" placeholder="车牌号" clearable style="width: 200px;" class="filter-item"
              @keyup.enter.native="handleFilter" @clear="getList"/>
    <el-input v-model="queryParams.project_name" placeholder="手机号" clearable style="width: 200px;" class="filter-item"
              @keyup.enter.native="handleFilter" @clear="getList"/>
    <el-date-picker v-model="value" type="daterange" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
    </el-date-picker>
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      {{ $t('table.search') }}
    </el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addCarsRepair">
      {{ $t('table.add') }}
    </el-button>
    <el-table :data="list" height="250" border style="width: 100%">
      <el-table-column prop="carsRepairText" label="姓名" width="180"></el-table-column>
      <el-table-column prop="carsRepairText" label="手机号" width="180"></el-table-column>
      <el-table-column prop="carsRepairText" label="车牌号" width="180"></el-table-column>
      <el-table-column prop="carsRepairText" label="维修内容" width="180"></el-table-column>
      <el-table-column prop="carsRepairType" label="维修类型" width="180"></el-table-column>
      <el-table-column prop="createTime" label="维修时间" width="180"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
  </div>
</template>
<script>
import {deleteCarsRepair, queryAllCarsRepair} from '@/api/carsRepair'

export default {
  name: 'CarRepair',
  data() {
    return {
      list: [],
      total: 0,
      queryParams: {pageNum: 1, pageSize: 10},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value: ''
    }
  },
  methods: {
    getList() {
      queryAllCarsRepair(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleFilter() {
      this.getList()
    },
    viewRepair(carsRepairId) {
      this.$router.push({
        path: '/job/add',
        query: {
          carsRepairId: carsRepairId
        }
      })
    },
    deleteCarsRepair(carsRepairId) {
      deleteCarsRepair(carsRepairId).then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除调度任务成功',
          type: 'success'
        })
      })
    },
    addCarsRepair() {
      this.$router.push('/carsRepair/addCarsRepair')
    }
  }
}
</script>
<style>
</style>
