<template>
  <div class="app-container">
    <div class="app-header">
      <el-select filterable allow-create v-model="queryParams.buyerUser" placeholder="买家姓名" clearable
                 style="width: 10%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in buyerUserList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.buyerIdCard" placeholder="买家身份证号" clearable
                 style="width: 10%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in buyerIdCardList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.buyerPhone" placeholder="买家手机号" clearable
                 style="width: 10%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in buyerPhoneList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.secondHandCarNumber" placeholder="二手车车牌号" clearable
                 style="width: 10%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.secondHandCarBrand" placeholder="二手车品牌" clearable
                 style="width: 10%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in carBrandList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-date-picker v-model="queryParams.startCreateTime" align="right" style="width: 10%;margin: 5px;" type="date"
                      placeholder="开始日期" @input="getList" @clear="getList" @keyup.enter.native="getList" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <el-date-picker v-model="queryParams.endCreateTime" align="right" style="width: 10%;margin: 5px;" type="date"
                      placeholder="结束日期" @input="getList" @clear="getList" @keyup.enter.native="getList" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addSecondHandCar">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="buyerUser" label="买家姓名" align="center"></el-table-column>
        <el-table-column prop="buyerIdCard" label="买家身份证号" align="center"></el-table-column>
        <el-table-column prop="buyerPhone" label="买家手机号" align="center"></el-table-column>
        <el-table-column prop="sellerUser" label="卖家姓名" align="center"></el-table-column>
        <el-table-column prop="sellerPhone" label="卖家手机号" align="center"></el-table-column>
        <el-table-column prop="secondHandCarNumber" label="二手车车牌号" align="center"></el-table-column>
        <el-table-column prop="secondHandCarBrand" label="二手车品牌" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px;" @click="selectSecondHandCarById(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="updateSecondHandCar(scope.row)">编辑</el-button>
<!--            <el-popconfirm title="确定删除吗？" @confirm="deleteCarsRepair(scope.row)">-->
<!--              <el-button type="danger" size="mini" style="min-width: 40px; margin-right: 10px" slot="reference">删除</el-button>-->
<!--            </el-popconfirm>-->
<!--            <el-popconfirm title="确定已经完成了吗？" @confirm="statusOperate(scope.row, 1)">-->
<!--              <el-button type="success" size="mini" style="min-width: 40px" slot="reference">是否完成</el-button>-->
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
    <el-dialog center title="二手车详细信息" top="5vh" :visible.sync="dialogVisible">
<!--      <pre>{{ this.detailsMessage }}</pre>-->
      <div align="center">
        <el-descriptions title="买家基本信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="姓名">{{ this.detailsMessage.buyerUser }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ this.detailsMessage.buyerIdCard }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ this.detailsMessage.buyerPhone }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.buyerAge }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.userPhoto }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ this.detailsMessage.buyerAddress }}</el-descriptions-item>
        </el-descriptions>
        <br><br>
        <el-descriptions title="卖家基本信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="姓名">{{ this.detailsMessage.sellerUser }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ this.detailsMessage.sellerIdCard }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ this.detailsMessage.sellerPhone }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.sellerAge }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.sellerSex }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ this.detailsMessage.sellerAddress }}</el-descriptions-item>
        </el-descriptions>
        <br><br>
        <el-descriptions title="车辆信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="二手车车牌号">{{ this.detailsMessage.secondHandCarNumber }}</el-descriptions-item>
          <el-descriptions-item label="二手车品牌">{{ this.detailsMessage.secondHandCarBrand }}</el-descriptions-item>
          <el-descriptions-item label="二手车名称">{{ this.detailsMessage.secondHandCarName }}</el-descriptions-item>
          <el-descriptions-item label="二手车车架号">{{ this.detailsMessage.secondHandCarEngineNumber }}</el-descriptions-item>
          <el-descriptions-item label="二手车图片">{{ this.detailsMessageImagesUrl }}</el-descriptions-item>
          <el-descriptions-item label="二手车金额">{{ this.detailsMessage.secondHandCarAmount }}</el-descriptions-item>
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

import {
  allSecondHandCar,
  deleteSecondHandCar, selectBuyerIdCards, selectBuyerPhones, selectBuyerUsers, selectCarBrands,
  selectCarNumbers,
  selectSecondHandCarById
} from '@/api/secondHandCar'

export default {
  name: 'ListSecondHandCar',
  data() {
    return {
      list: [],
      total: 0,
      carBrandList: [],
      carNumberList: [],
      buyerPhoneList: [],
      buyerUserList: [],
      buyerIdCardList: [],
      detailsMessage: '',
      detailsMessageImagesUrl: '',
      dialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        buyerUser: null,
        buyerPhone: null,
        buyerIdCard: null,
        secondHandCarBrand: null,
        secondHandCarNumber: null,
        startCreateTime: null,
        endCreateTime: null
      }
    }
  },
  mounted() {
    selectCarNumbers().then((res) => {
      this.carNumberList = res.data
    })
    selectCarBrands().then((res) => {
      this.carBrandList = res.data
    })
    selectBuyerPhones().then((res) => {
      this.buyerPhoneList = res.data
    })
    selectBuyerUsers().then((res) => {
      this.buyerUserList = res.data
    })
    selectBuyerIdCards().then((res) => {
      this.buyerIdCardList = res.data
    })
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      allSecondHandCar(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allSecondHandCar(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allSecondHandCar(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateSecondHandCar(row) {
      this.$router.push({
        path: '/secondHandCar/addSecondHandCar',
        query: {
          secondHandCarId: row.secondHandCarId
        }
      })
    },
    addSecondHandCar() {
      this.$router.push('/secondHandCar/addSecondHandCar')
    },
    deleteSecondHandCar(row) {
      deleteSecondHandCar(row.carsRepairNumber).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    selectSecondHandCarById(row) {
      this.dialogVisible = true
      selectSecondHandCarById(row.secondHandCarId).then(res => {
        this.detailsMessage = res.data
        this.detailsMessageImagesUrl = res.data.carPhoto.map(x => x.url)
      })
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
