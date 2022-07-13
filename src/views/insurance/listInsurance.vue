<template>
  <div class="app-container">
    <div class="app-header" style="width: 80%;">
      <el-select filterable allow-create v-model="queryParams.insuranceCompanyName" placeholder="保险公司名称" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in insuranceCompanyNameList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.insuranceCode" placeholder="保险单号" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in insuranceCodeList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.insuranceUser" placeholder="保险人" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in insuranceUserList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.insuranceIdCard" placeholder="保险人身份证号" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in insuranceIdCardList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select filterable allow-create v-model="queryParams.insurancePhone" placeholder="保险人手机号" clearable
                 style="width: 15%;margin-right: 5px;"
                 @input="getList"
                 @keyup.enter.native="getList"
                 @clear="getList">
        <el-option v-for="item in insurancePhoneList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addInsurance">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="insuranceCompanyName" label="保险公司名称" align="center"></el-table-column>
        <el-table-column prop="insuranceCode" label="保险单号" align="center"></el-table-column>
        <el-table-column prop="insuranceUser" label="保险人" align="center"></el-table-column>
        <el-table-column prop="insuranceIdCard" label="保险人身份证号" align="center"></el-table-column>
        <el-table-column prop="insurancePhone" label="保险人手机号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" sortable></el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px" @click="details(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="updateInsurance(scope.row)">编辑</el-button>
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
    <el-dialog center title="保险详细信息" top="10vh" :visible.sync="dialogVisible">
<!--            <pre>{{ this.detailsMessage}}</pre>-->
      <el-descriptions title="保险人基本信息" class="margin-top" :column="2" border>
        <el-descriptions-item label="保险公司名称">{{ this.detailsMessage.insuranceCompanyName }}</el-descriptions-item>
        <el-descriptions-item label="保险单号">{{ this.detailsMessage.insuranceCode }}</el-descriptions-item>
        <el-descriptions-item label="保险人">{{ this.detailsMessage.insuranceUser }}</el-descriptions-item>
        <el-descriptions-item label="保险人身份证号">{{ this.detailsMessage.insuranceIdCard }}</el-descriptions-item>
        <el-descriptions-item label="保险人手机号">{{ this.detailsMessage.insurancePhone }}</el-descriptions-item>
        <el-descriptions-item label="保险金额">{{ this.detailsMessage.insuranceAmount }}</el-descriptions-item>
        <el-descriptions-item label="保险车辆品牌">{{ this.detailsMessage.insuranceCarBrand }}</el-descriptions-item>
        <el-descriptions-item label="保险车辆名称">{{ this.detailsMessage.insuranceCarName }}</el-descriptions-item>
        <el-descriptions-item label="保险开始时间">{{ this.detailsMessage.insuranceStartTime }}</el-descriptions-item>
        <el-descriptions-item label="保险到期时间">{{ this.detailsMessage.insuranceEndTime }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ this.detailsMessage.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ this.detailsMessage.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  allInsurance,
  deleteInsurance,
  selectInsuranceCode,
  selectInsuranceCompanyName, selectInsuranceIdCard, selectInsurancePhone,
  selectInsuranceUser
} from '@/api/insurance';

export default {
  name: 'ListInsurance',
  data() {
    return {
      list: [],
      total: 0,
      insuranceCompanyNameList: [],
      insuranceCodeList: [],
      insuranceUserList: [],
      insuranceIdCardList: [],
      insurancePhoneList: [],
      metaDataType: 'INSURANCE_TYPE',
      dialogVisible: false,
      detailsMessage: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        insuranceCompanyName: null,
        insuranceCode: null,
        insuranceUser: null,
        insuranceIdCard: null,
        insurancePhone: null
      }
    }
  },
  mounted() {
    selectInsuranceCompanyName(this.metaDataType).then((res) => {
      this.insuranceCompanyNameList = res.data
    })
    selectInsuranceCode(this.metaDataType).then((res) => {
      this.insuranceCodeList = res.data
    })
    selectInsuranceUser(this.metaDataType).then((res) => {
      this.insuranceUserList = res.data
    })
    selectInsuranceIdCard(this.metaDataType).then((res) => {
      this.insuranceIdCardList = res.data
    })
    selectInsurancePhone(this.metaDataType).then((res) => {
      this.insurancePhoneList = res.data
    })
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      allInsurance(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allInsurance(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allInsurance(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateInsurance(row) {
      this.$router.push({
        path: '/insurance/addInsurance',
        query: {
          insuranceCode: row.insuranceCode
        }
      })
    },
    deleteInsurance(row) {
      deleteInsurance(row.insuranceId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    addInsurance() {
      this.$router.push('/insurance/addInsurance')
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
