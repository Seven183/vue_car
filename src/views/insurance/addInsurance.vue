<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="insurance_form" label-width=auto :rules="form_rules" :model="request_body" class="demo-ruleForm">
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
        <div>
          <el-form-item>
            <el-button v-if="createStatus" type="primary" @click="addInsurance">立即保存</el-button>
            <el-button v-if="!createStatus" type="primary" @click="updateInsurance">立即更新</el-button>
            <el-button @click="backHistory">返回</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {queryMetaDataByType} from '@/api/metaData'
import {addInsurance, selectInsuranceByInsuranceCode, updateInsurance} from '@/api/insurance'

export default {
  name: 'AddInsurance',
  data() {
    return {
      metaDataType: 'INSURANCE_TYPE',
      carBrandMetaDataType: 'CAR_BRAND_TYPE',
      metaDataList: [],
      carBrandList: [],
      createStatus: true,
      form_rules: {
        insuranceCompanyName: [{required: true, message: '保险公司不能为空', trigger: 'blur'}],
        insuranceCode: [{required: true, message: '保险单号不能为空', trigger: 'blur'}],
        insuranceUser: [{required: true, message: '保险人不能为空', trigger: 'blur'}],
        insuranceIdCard: [{required: true, message: '身份证不能为空', trigger: 'blur'}]
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
    const query = this.$route.query
    if (query.insuranceCode) {
      this.createStatus = false
      selectInsuranceByInsuranceCode(query.insuranceCode).then((res) => {
        this.request_body = res.data
      })
    }
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
    queryMetaDataByType(this.carBrandMetaDataType).then((res) => {
      this.carBrandList = res.data
    })
  },
  methods: {
    updateInsurance() {
      this.$refs['insurance_form'].validate((valid) => {
        if (valid) {
          updateInsurance(this.request_body).then((res) => {
            this.$router.push('/insurance/allInsurance')
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },
    addInsurance() {
      this.$refs['insurance_form'].validate((valid) => {
        if (valid) {
          addInsurance(this.request_body).then((res) => {
            var message = res.success
            if (message === true) {
              this.$router.push('/insurance/allInsurance')
              this.$notify({title: '成功', message: '创建成功', type: 'success'})
            } else {
              this.$alert(this.message['data'], '创建失败', {confirmButtonText: '确定'})
            }
          })
        }
      })
    },
    backHistory() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.create .create-body {
  padding: 50px 20px
}

.el-form-item__content {
  width: 250px
}

.demo-ruleForm .el-input__inner {
  width: 0
}
</style>
