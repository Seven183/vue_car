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
      <el-button style="margin: 5px;" type="success" icon="el-icon-edit" @click="add">
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
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="edit(scope.row)">编辑</el-button>
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
    <!--  添加/更新保险模块保险信息  -->
    <el-dialog center :title=title top="10vh" :visible.sync="insuranceDialogVisible">
      <el-form ref="insurance_form" label-width="200px" :rules="form_rules" :model="request_body" inline>
        <el-form-item label="保险公司名称" prop="insuranceCompanyName">
          <el-select v-model="request_body.insuranceCompanyName" filterable allow-create clearable style="width: 240px" placeholder="请选择保险公司名称">
            <el-option v-for="item in metaDataList" :key="item" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保险单号" prop="insuranceCode">
          <el-input v-model="request_body.insuranceCode" placeholder="请输入保险单号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="保险人" prop="insuranceUser">
          <el-input v-model="request_body.insuranceUser" placeholder="请输入保险人" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="保险人身份证号" prop="insuranceIdCard">
          <el-input v-model="request_body.insuranceIdCard" placeholder="请输入保险人身份证号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="保险人手机号" prop="insurancePhone">
          <el-input v-model.number="request_body.insurancePhone" placeholder="请输入保险人手机号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="保险金额" prop="insuranceAmount">
          <el-input v-model.number="request_body.insuranceAmount" placeholder="请输入保险金额" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="保险车辆品牌" prop="insuranceCarBrand">
          <el-select v-model="request_body.insuranceCarBrand" filterable allow-create clearable style="width: 240px" placeholder="请选择保险车辆品牌">
            <el-option v-for="item in carBrandList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保险车辆名称" prop="insuranceCarName">
          <el-input v-model="request_body.insuranceCarName" placeholder="请输入保险车辆名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="保险开始时间" prop="insuranceStartTime">
          <el-date-picker v-model="request_body.insuranceStartTime" align="right" style="width: 240px" type="date"
                          placeholder="请选择保险开始时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保险到期时间" prop="insuranceEndTime">
          <el-date-picker v-model="request_body.insuranceEndTime" align="right" style="width: 240px" type="date"
                          placeholder="请选择保险到期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button v-if="addInsuranceDialogVisible" type="primary" @click="addInsurance">立即保存</el-button>
        <el-button v-if="updateInsuranceDialogVisible" type="primary" @click="updateInsurance">立即更新</el-button>
        <el-button type="primary" @click="cancel()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addInsurance,
  allInsurance,
  deleteInsurance, selectInsuranceByInsuranceCode,
  selectInsuranceCode,
  selectInsuranceCompanyName, selectInsuranceIdCard, selectInsurancePhone,
  selectInsuranceUser, updateInsurance
} from '@/api/insurance'
import {queryMetaDataByType} from "@/api/metaData";

export default {
  name: 'ListInsuranceDialog',
  data() {
    const moneyReg = (rule, value, callback) => {
  setTimeout(() => {
    if (!/^\d+[.]?\d{0,2}$/.test(value) && value) {
      callback(new Error('请输入正整数或小数保留两位小数'))
    } else {
      callback()
    }
  }, 500)
}
    return {
      list: [],
      total: 0,
      insuranceCompanyNameList: [],
      insuranceCodeList: [],
      insuranceUserList: [],
      insuranceIdCardList: [],
      insurancePhoneList: [],
      metaDataType: 'INSURANCE_TYPE',
      carBrandMetaDataType: 'CAR_BRAND_TYPE',
      metaDataList: [],
      carBrandList: [],
      title: '添加保险信息',
      dialogVisible: false,
      detailsMessage: '',
      insuranceDialogVisible: false,
      addInsuranceDialogVisible: false,
      updateInsuranceDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        insuranceCompanyName: null,
        insuranceCode: null,
        insuranceUser: null,
        insuranceIdCard: null,
        insurancePhone: null
      },
      form_rules: {
        insuranceCompanyName: [{required: true, message: '保险公司不能为空', trigger: 'blur'}],
        insuranceCode: [{required: true, message: '保险单号不能为空', trigger: 'blur'}],
        insuranceUser: [{required: true, message: '保险人不能为空', trigger: 'blur'}],
        insuranceIdCard: [{required: true, message: '身份证不能为空', trigger: 'blur'}],
        insuranceAmount: [{ validator: moneyReg, trigger: 'blur' }]
      },
      request_body: {
        insuranceCompanyName: null,
        insuranceCode: null,
        insuranceUser: null,
        insuranceIdCard: null,
        insurancePhone: null,
        insuranceAmount: null,
        insuranceCarBrand: null,
        insuranceCarName: null,
        insuranceStartTime: null,
        insuranceEndTime: null
      }
    }
  },
  mounted() {
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
    queryMetaDataByType(this.carBrandMetaDataType).then((res) => {
      this.carBrandList = res.data
    })
    selectInsuranceCompanyName().then((res) => {
      this.insuranceCompanyNameList = res.data
    })
    selectInsuranceCode().then((res) => {
      this.insuranceCodeList = res.data
    })
    selectInsuranceUser().then((res) => {
      this.insuranceUserList = res.data
    })
    selectInsuranceIdCard().then((res) => {
      this.insuranceIdCardList = res.data
    })
    selectInsurancePhone().then((res) => {
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
    edit(row) {
      this.title = '更新保险信息'
      selectInsuranceByInsuranceCode(row.insuranceCode).then((res) => {
        this.request_body = res.data
        if (res.success === true) {
          this.insuranceDialogVisible = true
          this.addInsuranceDialogVisible = false
          this.updateInsuranceDialogVisible = true
        }
      })
    },
    deleteInsurance(row) {
      deleteInsurance(row.insuranceId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    add() {
      this.title = '添加保险信息'
      this.request_body = {}
      this.insuranceDialogVisible = true
      this.addInsuranceDialogVisible = true
      this.updateInsuranceDialogVisible = false
      this.$refs['insurance_form'].resetFields()
    },
    updateInsurance() {
      this.$refs['insurance_form'].validate((valid) => {
        if (valid) {
          updateInsurance(this.request_body).then((res) => {
            this.insuranceDialogVisible = false
            this.$router.go(0)
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },
    addInsurance() {
      this.$refs['insurance_form'].validate((valid) => {
        if (valid) {
          addInsurance(this.request_body).then((res) => {
            this.insuranceDialogVisible = false
            this.getList()
            if (res.success === true) {
              this.$notify({title: '成功', message: '创建成功', type: 'success'})
            } else {
              this.$alert(this.message['data'], '创建失败', {confirmButtonText: '确定'})
            }
          })
        }
      })
    },
    details(row) {
      this.dialogVisible = true
      this.detailsMessage = row
    },
    cancel() {
      this.insuranceDialogVisible = false
      this.request_body = {}
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
