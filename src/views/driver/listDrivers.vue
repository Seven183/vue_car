<template>
  <div class="app-container" >
    <div class="app-header" style="width: 80%;">
      <el-input v-model="queryParams.driverName" placeholder="驾驶人" clearable style="width: 15%;margin-right: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-select filterable allow-create clearable placeholder="性别" v-model="queryParams.sex" style="width: 15%;margin: 5px;"
                 @keyup.enter.native="getList"
                 @input="getList"
                 @clear="getList">
        <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
      </el-select>
      <el-input v-model="queryParams.phone" placeholder="联系方式" clearable style="width: 15%;margin: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-input v-model="queryParams.address" placeholder="联系地址" clearable style="width: 15%;margin: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addDriver">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="driverName" label="驾驶人" align="center"></el-table-column>
        <el-table-column prop="sex" label="驾驶人性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
        <el-table-column prop="address" label="联系地址" align="center"></el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="min-width: 50px;margin-right: 10px" @click="updateDriver(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteDriver(scope.row)">
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

import {allDrivers, deleteDriver} from '@/api/driver';
import {queryMetaDataByType} from '@/api/metaData';

export default {
  name: 'ListDriver',
  mounted() {
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
    this.getList()
  },
  data() {
    return {
      list: [],
      total: 0,
      metaDataList: [],
      metaDataType: 'SEX_TYPE',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: null,
        sex: null,
        phone: null,
        address: null
      }
    }
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      allDrivers(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allDrivers(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allDrivers(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateDriver(row) {
      this.$router.push({
        path: '/driver/addDriver',
        query: {
          driverId: row.driverId
        }
      })
    },
    deleteDriver(row) {
      deleteDriver(row.driverId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    addDriver() {
      this.$router.push('/driver/addDriver')
    }
  }
}
</script>

<style>
  .app-container {
    padding: 50px;
    background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
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
