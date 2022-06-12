<template>
  <div class="app-container">
    <div class="app-header">
      <el-input v-model="queryParams.userName" placeholder="姓名" clearable style="width: 200px;margin: 5px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" @clear="getList"/>
      <el-input v-model="queryParams.phone" placeholder="手机号" clearable style="width: 200px;margin: 5px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" @clear="getList"/>
      <el-input v-model="queryParams.carNumber" placeholder="车牌号" clearable style="width: 200px;margin: 5px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" @clear="getList"/>
      <el-date-picker v-model="queryParams.createTimeArray" type="daterange" align="right" unlink-panels range-separator="至"
                      start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit"
                 @click="addCarsRepair">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" height="500" border style="width: 100%">
        <el-table-column prop="userName" label="姓名" width="180" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
        <el-table-column prop="carNumber" label="车牌号" width="180" align="center"></el-table-column>
        <el-table-column prop="carsRepairType" label="维修类型" width="180" align="center"></el-table-column>
        <el-table-column prop="carsRepairText" label="维修内容" width="180" align="center"></el-table-column>
        <el-table-column prop="createTime" label="维修时间" width="240" align="center" sortable></el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" min-width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="min-width: 40px" @click="updateCarsRepair(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" style="min-width: 40px" @click="deleteCarsRepair(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="app-footer">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"/>
    </div>
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
      queryParams: {pageNum: 1, pageSize: 10, userName: null, phone: null, carNumber: null, createTimeArray: this.createTimeArray},
      // queryParams: {pageNum: 1, pageSize: 10},
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
      createTimeArray: [],
      request_body: {
        username: null,
        phone: null,
        carNumber: null,
        carsRepairType: null,
        carsRepairText: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      queryAllCarsRepair(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateCarsRepair(row) {
      this.$router.push({
        path: '/carsRepair/addCarsRepair',
        query: {
          carsRepairId: row.carsRepairId
        }
      })
    },
    deleteCarsRepair(row) {
      deleteCarsRepair(row.carsRepairId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
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
