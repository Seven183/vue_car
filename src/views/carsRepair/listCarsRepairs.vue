<template>
  <div class="app-container">
    <div class="app-header" style="width: 80%;">
      <el-select filterable allow-create v-model="queryParams.carsRepairType" placeholder="维修类型" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
      </el-select>
<!--      <el-input v-model="queryParams.userName" placeholder="姓名" clearable style="width: 15%;margin-right: 5px;"-->
<!--                @keyup.enter.native="getList"-->
<!--                @clear="getList"-->
<!--                @input="getList"/>-->
<!--      <el-input v-model="queryParams.phone" placeholder="手机号" clearable style="width: 15%;margin: 5px;"-->
<!--                @input="getList"-->
<!--                @keyup.enter.native="getList"-->
<!--                @clear="getList"/>-->
      <el-input v-model="queryParams.carNumber" placeholder="车牌号" clearable style="width: 15%;margin: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-date-picker v-model="queryParams.startCreateTime" align="right" style="width: 15%;margin: 5px;" type="date"
                      placeholder="开始日期" @input="getList" @clear="getList" @keyup.enter.native="getList" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <el-date-picker v-model="queryParams.endCreateTime" align="right" style="width: 15%;margin: 5px;" type="date"
                      placeholder="结束日期" @input="getList" @clear="getList" @keyup.enter.native="getList" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addCarsRepair">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="carsRepairType" label="维修类型" align="center"></el-table-column>
        <el-table-column prop="carsRepairText" label="维修内容" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="维修时间" align="center" sortable></el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="updateCarsRepair(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteCarsRepair(scope.row)">
              <el-button type="danger" size="mini" style="min-width: 40px" slot="reference">删除</el-button>
            </el-popconfirm>
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
import {queryMetaDataByType} from '@/api/metaData'

export default {
  name: 'ListCarsRepairs',
  data() {
    return {
      list: [],
      total: 0,
      metaDataList: [],
      metaDataType: 'FAULT_TYPE',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        phone: null,
        carNumber: null,
        startCreateTime: null,
        endCreateTime: null
      }
    }
  },
  mounted() {
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
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
  .app-container {
    padding: 50px;
    background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
    /*background-image: url("~@/assets/404_images/404.png");*/
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
  }
  .app-header {
    padding-bottom: 30px;
  }
  .app-body{
    margin-top: 20px;
  }
  .app-footer {
    margin-top: 60px;
  }

  .el-table__row td, .has-gutter th {
    border: 1px solid #e5e7da;
  }

  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #e5e7da;
  }

</style>
