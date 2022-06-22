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
      <el-select filterable allow-create clearable placeholder="设备类型" v-model="queryParams.advicesType"
                 style="width: 15%; margin-right: 5px;"
                 @keyup.enter.native="getList"
                 @input="getList"
                 @clear="getList">
        <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
      </el-select>
      <el-input v-model="queryParams.advicesName" placeholder="设备名称" clearable style="width: 15%;margin: 5px;"
                @keyup.enter.native="getList"
                @clear="getList"
                @input="getList"/>
      <el-select filterable allow-create v-model="queryParams.status" placeholder="维修状态" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in carRepairStatusMetaDataList" :key="item.id" :label="item.code" :value="item.value"/>
      </el-select>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addAdvice">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="advicesType" label="设备类型" align="center"></el-table-column>
        <el-table-column prop="advicesName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="advicesQuantity" label="设备数量" align="center"></el-table-column>
        <el-table-column prop="advicesPriceAmount" label="设备单价金额" align="center" sortable></el-table-column>
        <el-table-column prop="advicesFullAmount" label="设备总金额" align="center" sortable></el-table-column>
        <el-table-column prop="createTime" label="添加设备时间" align="center" sortable></el-table-column>
        <el-table-column prop="status" label="维修状态" align="center" sortable>
          <template slot-scope="scope">
            <el-tag v-for="item in status_list" v-if="item.key === scope.row.status" :type="item.type">
              {{ item.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px" @click="details(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="updateAdvice(scope.row)">编辑</el-button>
<!--            <el-popconfirm title="确定删除吗？" @confirm="deleteAdvice(scope.row)">-->
<!--              <el-button type="danger" size="mini" style="min-width: 40px" slot="reference">删除</el-button>-->
<!--            </el-popconfirm>-->
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
    <el-dialog center title="维修设备详细信息" top="10vh" :visible.sync="dialogVisible">
<!--            <pre>{{ this.detailsMessage}}</pre>-->
      <div align="center">
        <el-descriptions title="设备信息" class="margin-top" :column="2" :size="size" border>
          <el-descriptions-item label="车牌号">{{ this.detailsMessage.carNumber }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">{{ this.detailsMessage.advicesType }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ this.detailsMessage.advicesName }}</el-descriptions-item>
          <el-descriptions-item label="设备编号">{{ this.detailsMessage.advicesNumber }}</el-descriptions-item>
          <el-descriptions-item label="设备数量">{{ this.detailsMessage.advicesQuantity }}</el-descriptions-item>
          <el-descriptions-item label="设备单价金额">{{ this.detailsMessage.advicesPriceAmount }}</el-descriptions-item>
          <el-descriptions-item label="设备总金额">{{ this.detailsMessage.advicesFullAmount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ this.detailsMessage.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ this.detailsMessage.updateTime }}</el-descriptions-item>
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
import {allAdvices, deleteAdvice} from '@/api/advices';
import {queryMetaDataByType} from "@/api/metaData";
import {selectCarNumbers} from "@/api/carsRepair";

export default {
  name: 'ListAdvices',
  data() {
    return {
      list: [],
      total: 0,
      metaDataList: [],
      carNumberList: [],
      metaDataType: 'ADVICE_TYPE',
      carRepairStatusMetaDataList: [],
      carRepairStatusMetaDataType: 'CARREPAIR_STATUS_TYPE',
      status_list: [
        {key: 0, value: '维修中', type: "warn"},
        {key: 1, value: '维修完成', type: "success"}
      ],
      dialogVisible: false,
      detailsMessage: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        carNumber: null,
        advicesType: null,
        advicesName: null,
        advicesNumber: null
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
    queryMetaDataByType(this.carRepairStatusMetaDataType).then((res) => {
      this.carRepairStatusMetaDataList = res.data
    })
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      allAdvices(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allAdvices(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allAdvices(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateAdvice(row) {
      this.$router.push({
        path: '/test/test1',
        query: {
          carsRepairNumber: row.carsRepairNumber
        }
      })
    },
    deleteAdvice(row) {
      deleteAdvice(row.advicesId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    addAdvice() {
      this.$router.push('/test/test1')
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
