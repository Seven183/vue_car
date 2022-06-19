<template>
  <div class="app-container" >
    <div class="app-header" style="width: 80%;">
      <el-input v-model="queryParams.driverName" placeholder="姓名" clearable style="width: 15%;margin-right: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-input v-model="queryParams.phone" placeholder="联系方式" clearable style="width: 15%;margin: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-select filterable allow-create v-model="queryParams.carNumber" placeholder="车牌号" clearable
                 style="width: 15%;margin: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.carBrand" placeholder="车品牌" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
      </el-select>
      <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
      </el-select>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addDriver">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row style="overflow:auto">
        <el-table-column prop="driverName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="carBrand" label="车辆品牌" align="center"></el-table-column>
        <el-table-column prop="carName" label="车辆名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="维修时间" align="center" sortable></el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px" @click="details(scope.row)">详情</el-button>
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
    <el-dialog center title="车主详细信息" top :visible.sync="dialogVisible">
<!--      <pre>{{ this.detailsMessage}}</pre>-->
      <div align="center">
        <el-descriptions title="车主信息" class="margin-top" :column="2" :size="size" border>
          <el-descriptions-item label="用户名">{{ this.detailsMessage.driverName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.sex }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.age }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ this.detailsMessage.phone }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ this.detailsMessage.address }}</el-descriptions-item>
          <el-descriptions-item label="驾驶人照片">{{ this.detailsMessage.driverPhoto }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ this.detailsMessage.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ this.detailsMessage.updateTime }}</el-descriptions-item>
        </el-descriptions> <br><br>
        <el-descriptions title="车主车辆信息" class="margin-top" :column="2" :size="size" border>
          <el-descriptions-item label="车牌号">{{ this.detailsMessage.carNumber }}</el-descriptions-item>
          <el-descriptions-item label="汽车品牌">{{ this.detailsMessage.carBrand }}</el-descriptions-item>
          <el-descriptions-item label="汽车名称">{{ this.detailsMessage.carName }}</el-descriptions-item>
          <el-descriptions-item label="车架号">{{ this.detailsMessage.engineNumber }}</el-descriptions-item>
          <el-descriptions-item label="汽车图片">{{ this.detailsMessage.carPhoto }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {allDrivers, deleteDriver} from '@/api/driver';
import {queryMetaDataByType} from '@/api/metaData';
import {detailsByCarNumber, selectCarNumbers} from "@/api/carsRepair";

export default {
  name: 'ListDriver',
  data() {
    return {
      list: [],
      total: 0,
      metaDataList: [],
      carNumberList: [],
      metaDataType: 'CAR_BRAND_TYPE',
      dialogVisible: false,
      detailsMessage: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        driverName: null,
        sex: null,
        phone: null,
        address: null
      }
    }
  },
  mounted() {
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
    selectCarNumbers().then((res) => {
      this.carNumberList = res.data
    })
    this.getList()
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
    },
    details(row) {
      this.dialogVisible = true
      this.detailsMessage = row
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
