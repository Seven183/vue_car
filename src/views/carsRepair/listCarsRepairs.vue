<template>
  <div class="app-container">
    <div class="app-header" style="width: 80%;">
      <el-select filterable allow-create v-model="queryParams.carNumber" placeholder="车牌号" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.carsRepairType" placeholder="维修类型" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in faultMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.status" placeholder="维修状态" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in carRepairStatusMetaDataList" :key="item.id" :label="item.code" :value="item.value"/>
      </el-select>
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
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="carsRepairType" label="维修类型" align="center"></el-table-column>
        <el-table-column prop="carsRepairText" label="维修内容" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="维修时间" align="center" sortable></el-table-column>
        <el-table-column prop="status" label="维修状态" align="center" sortable>
          <template slot-scope="scope">
            <el-tag v-for="item in status_list" v-if="item.key === scope.row.status" :type="item.type">
              {{ item.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px;" @click="detailsByCarNumber(scope.row.carNumber)">详情</el-button>
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="updateCarsRepair(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteCarsRepair(scope.row)">
              <el-button type="danger" size="mini" style="min-width: 40px; margin-right: 10px" slot="reference">删除</el-button>
            </el-popconfirm>
            <el-popconfirm title="确定已经完成了吗？" @confirm="statusOperate(scope.row, 1)">
              <el-button type="success" size="mini" style="min-width: 40px" slot="reference">是否完成</el-button>
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
    <el-dialog center title="车辆维修详细信息" top :visible.sync="dialogVisible">
      <pre>{{ this.detailsMessage }}</pre>
      <ul>
        <div v-for="item of this.detailsMessage" :key="index">
          {{item}}
        </div>
      </ul>
<!--      JSON.parse({{ this.detailsMessage }})-->
<!--      <span v-if="this.detailsMessage.carsRepair.size()>0">-->
<!--        车辆维修 : {{this.detailsMessage.carsRepair}} <br/>-->
<!--      </span>-->
      <!--        维修设备 : {{this.detailsMessage.advices}} <br/>-->
<!--        车主信息 : {{this.detailsMessage.drivers}} <br/>-->
<!--        车辆信息 : {{this.detailsMessage.cars}} <br/>-->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  deleteCarsRepair,
  detailsByCarNumber,
  queryAllCarsRepair,
  selectCarNumbers,
  statusOperate
} from '@/api/carsRepair'
import {queryMetaDataByType} from '@/api/metaData'

export default {
  name: 'ListCarsRepairs',
  data() {
    return {
      list: [],
      total: 0,
      faultMetaDataList: [],
      faultMetaDataType: 'FAULT_TYPE',
      carRepairStatusMetaDataList: [],
      carRepairStatusMetaDataType: 'CARREPAIR_STATUS_TYPE',
      carNumberList: [],
      status_list: [
        {key: 0, value: '维修中', type: "warn"},
        {key: 1, value: '维修完成', type: "success"}
      ],
      detailsMessage: null,
      dialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        carNumber: null,
        startCreateTime: null,
        endCreateTime: null
      }
    }
  },
  mounted() {
    queryMetaDataByType(this.faultMetaDataType).then((res) => {
      this.faultMetaDataList = res.data
    })
    queryMetaDataByType(this.carRepairStatusMetaDataType).then((res) => {
      this.carRepairStatusMetaDataList = res.data
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
    statusOperate(row, status) {
      statusOperate(row.carsRepairId, status).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '已完成', type: 'success'})
      })
    },
    detailsByCarNumber(carNumber) {
      this.dialogVisible = true
      detailsByCarNumber(carNumber).then(res => {
        this.detailsMessage = res.data
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
