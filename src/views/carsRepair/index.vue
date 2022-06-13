<template>
  <div class="app-container">
    <div class="app-header">
      <el-input v-model="queryParams.userName" placeholder="姓名" clearable style="width: 200px;margin: 5px;"
                class="filter-item"
                @keyup.enter.native="getList"
                @clear="getList"
                @input="getList"/>
      <el-input v-model="queryParams.phone" placeholder="手机号" clearable style="width: 200px;margin: 5px;"
                class="filter-item"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-input v-model="queryParams.carNumber" placeholder="车牌号" clearable style="width: 200px;margin: 5px;"
                class="filter-item"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-date-picker v-model="queryParams.startCreateTime" align="right" style="width: 200px;margin: 5px;" type="date"
                      placeholder="开始日期" :picker-options="pickerOptions"></el-date-picker>
      <el-date-picker v-model="queryParams.endCreateTime" align="right" style="width: 200px;margin: 5px;" type="date"
                      placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
      <el-button class="filter-item" style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addCarsRepair">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" fit stripe border highlight-current-row style="width: 100%">
        <el-table-column prop="userName" label="姓名" width="180" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
        <el-table-column prop="carNumber" label="车牌号" width="180" align="center"></el-table-column>
        <el-table-column prop="carsRepairType" label="维修类型" width="180" align="center"></el-table-column>
        <el-table-column prop="carsRepairText" label="维修内容" width="180" align="center"></el-table-column>
        <el-table-column prop="createTime" label="维修时间" width="240" align="center" sortable></el-table-column>
        <el-table-column :label="$t('table.actions')"
                         align="center"
                         min-width="230"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="min-width: 40px" @click="updateCarsRepair(scope.row)">编辑
            </el-button>
            <el-button type="danger" size="mini" style="min-width: 40px" @click="deleteCarsRepair(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="app-footer">
      <el-pagination
        v-show="total>0"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        :page-count="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        @current-change="getListByNumber"
        @size-change="getListByPage"/>
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
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        phone: null,
        carNumber: null,
        startCreateTime: null,
        endCreateTime: null
      },
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
    getListByPage(size) {
      this.queryParams.pageSize = size
      queryAllCarsRepair(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
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
.app-body{
  margin-top: 20px;
}
.app-footer {
  margin-top: 50px;
}

</style>
