<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="advices_form" label-width="200px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
        <el-form-item label="车牌号" prop="advicesType">
          <el-select filterable allow-create clearable v-model="request_body.carNumber" style="width: 240px">
            <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="advicesType">
          <el-select filterable allow-create clearable v-model="request_body.advicesType" style="width: 240px">
            <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="advicesName">
          <el-input v-model="request_body.advicesName" placeholder="请输入设备名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="设备编号" prop="advicesNumber">
          <el-input v-model="request_body.advicesNumber" placeholder="请输入设备编号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="设备数量" prop="advicesQuantity">
          <el-input v-model.number="request_body.advicesQuantity" placeholder="请输入设备数量" style="width: 240px" @input="advicesFullAmount"/>
        </el-form-item>
        <el-form-item label="设备单价金额" prop="advicesPriceAmount">
          <el-input v-model="request_body.advicesPriceAmount" placeholder="请输入设备单价金额" style="width: 240px" @input="advicesFullAmount"/>
        </el-form-item>
        <el-form-item label="设备总金额" prop="advicesFullAmount">
          <el-input v-model="request_body.advicesFullAmount" placeholder="请输入设备总金额" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="createStatus" type="primary" @click="addAdvice">立即添加</el-button>
          <el-button v-if="!createStatus" type="primary" @click="updateAdvice">立即保存</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {queryMetaDataByType} from '@/api/metaData';
import {addAdvice, selectAdvicesByCarsRepairNumber, updateAdvice} from '@/api/advices';
import {selectCarNumbers} from "@/api/carsRepair";

export default {
  name: 'AddAdvices',
  data() {
    const moneyReg = (rule, value, callback) => {
      if (value.length > 10) {
        callback(new Error('长度在 0 到 10 个字符'))
      } else {
        setTimeout(() => {
          if (!/^\d+[.]?\d{0,2}$/.test(value) && value) {
            callback(new Error('请输入正整数或小数保留两位小数'))
          } else {
            callback()
          }
        }, 500)
      }
    }
    return {
      metaDataType: 'ADVICE_TYPE',
      metaDataList: [],
      carNumberList: [],
      createStatus: true,
      form_rules: {
        carNumber: [{required: true, message: '车牌号不能为空', trigger: 'blur'}],
        advicesType: [{required: true, message: '设备类型不能为空', trigger: 'blur'}],
        advicesName: [{required: true, message: '设备名称不能为空', trigger: 'change'}],
        advicesQuantity: [{type: 'number', required: true, message: '设备数量不能为空且为整数', trigger: 'change'}],
        advicesPriceAmount: [{validator: moneyReg, trigger: 'blur'}, {required: true, message: '设备单价金额不能为空'}]
      },
      request_body: {
        carNumber: null,
        advicesType: null,
        advicesName: null,
        advicesNumber: null,
        advicesQuantity: null,
        advicesPriceAmount: null,
        advicesFullAmount: null
      }
    }
  },
  mounted() {
    const query = this.$route.query
    if (query.carsRepairNumber) {
      this.createStatus = false
      selectAdvicesByCarsRepairNumber(query.carsRepairNumber).then((res) => {
        this.request_body = res.data
      })
    }
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
    selectCarNumbers().then((res) => {
      this.carNumberList = res.data
    })
  },
  methods: {
    advicesFullAmount() {
      this.request_body.advicesFullAmount = this.request_body.advicesQuantity * this.request_body.advicesPriceAmount
    },
    updateAdvice() {
      this.$refs['advices_form'].validate((valid) => {
        if (valid) {
          updateAdvice(this.request_body).then((res) => {
            this.$router.push('/advice/allAdvices')
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },

    addAdvice() {
      this.$refs['advices_form'].validate((valid) => {
        if (valid) {
          addAdvice(this.request_body).then((res) => {
            var message = res.success
            if (message === true) {
              this.$router.push('/advice/allAdvices')
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
