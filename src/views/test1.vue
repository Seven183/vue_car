<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="advices_form" label-width="200px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
        <el-form-item label="车牌号" prop="carNumber">
          <el-select v-model="request_body.carNumber" filterable allow-create clearable style="width: 240px">
            <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <!--                <el-form-item label="设备类型" prop="advicesType">-->
        <!--                  <el-select filterable allow-create clearable v-model="request_body.advicesType" style="width: 240px">-->
        <!--                    <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>-->
        <!--                  </el-select>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item label="设备名称" prop="advicesName">-->
        <!--                  <el-input v-model="request_body.advicesName" placeholder="请输入设备名称" style="width: 240px"/>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item label="设备编号" prop="advicesNumber">-->
        <!--                  <el-input v-model="request_body.advicesNumber" placeholder="请输入设备编号" style="width: 240px"/>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item label="设备数量" prop="advicesQuantity">-->
        <!--                  <el-input v-model.number="request_body.advicesQuantity" placeholder="请输入设备数量" style="width: 240px" @input="advicesFullAmount"/>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item label="设备单价金额" prop="advicesPriceAmount">-->
        <!--                  <el-input v-model="request_body.advicesPriceAmount" placeholder="请输入设备单价金额" style="width: 240px" @input="advicesFullAmount"/>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item label="设备总金额" prop="advicesFullAmount">-->
        <!--                  <el-input v-model="request_body.advicesFullAmount" placeholder="请输入设备总金额" style="width: 240px"/>-->
        <!--                </el-form-item>-->
        <el-form-item>
          <el-button type="success" class="check_filter" icon="el-icon-plus" @click="add_item()">添加设备信息</el-button>
        </el-form-item>

        <el-form v-for="(filter,index) in request_body.items" :key="filter.id" label-width="200px" :model="filter" inline>
          <el-form-item label="设备类型" prop="advicesType" :rules="form_rules.advicesType">
            <el-select v-model="filter.advicesType" filterable allow-create clearable style="width: 300px">
              <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="advicesName" :rules="form_rules.advicesName">
            <el-input v-model="filter.advicesName" placeholder="请输入设备名称" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="设备编号" prop="advicesNumber" :rules="form_rules.advicesNumber">
            <el-input v-model="filter.advicesNumber" placeholder="请输入设备编号" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="设备数量" prop="advicesQuantity" :rules="form_rules.advicesQuantity">
            <el-input v-model.number="filter.advicesQuantity" placeholder="请输入设备数量" style="width: 300px"
                      @input="advicesItemsFullAmount(index)"/>
          </el-form-item>
          <el-form-item label="设备单价金额" prop="advicesPriceAmount" :rules="form_rules.advicesPriceAmount">
            <el-input v-model="filter.advicesPriceAmount" placeholder="请输入设备单价金额" style="width: 300px"
                      @input="advicesItemsFullAmount(index)"/>
          </el-form-item>
          <el-form-item label="设备总金额">
            <el-input v-model="filter.advicesFullAmount" placeholder="请输入设备总金额" style="width: 300px ;margin-right: 30px"/>
            <el-button type="danger" icon="el-icon-delete" circle class="delete_icon" @click="delete_item(filter)"/>
            <br><br>
          </el-form-item>
        </el-form>

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
import {queryMetaDataByType} from '@/api/metaData'
import {addAdvice, selectAdvicesByCarsRepairNumber, updateAdvice} from '@/api/advices'
import {selectCarNumbers} from '@/api/carsRepair'
import {createUniqueString} from '@/utils'

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
      dialogVisible: false,
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
        items: []
        // advicesType: null,
        // advicesName: null,
        // advicesNumber: null,
        // advicesQuantity: null,
        // advicesPriceAmount: null,
        // advicesFullAmount: null
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
    add_item() {
      const item = {
        id: createUniqueString(),
        advicesType: this.request_body.advicesType,
        advicesName: this.request_body.advicesName,
        advicesNumber: this.request_body.advicesNumber,
        advicesQuantity: this.request_body.advicesQuantity,
        advicesPriceAmount: this.request_body.advicesPriceAmount,
        advicesFullAmount: this.request_body.advicesFullAmount
      }
      this.request_body.items.push(item)
    },
    delete_item(filter) {
      console.log(filter.id)
      // this.request_body.items = this.request_body.items.splice(filter.id, 1)
      this.request_body.items = this.request_body.items.filter(item => item.id !== filter.id)
    },
    advicesFullAmount() {
      this.request_body.advicesFullAmount = this.request_body.advicesQuantity * this.request_body.advicesPriceAmount
    },
    advicesItemsFullAmount(index) {
      this.request_body.items[index].advicesFullAmount = this.request_body.items[index].advicesQuantity * this.request_body.items[index].advicesPriceAmount
    },
    updateAdvice() {
      this.$refs['advices_form'].validate((valid) => {
        if (valid) {
          updateAdvice(this.request_body).then((res) => {
            this.$router.push('/test/test1')
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },

    addAdvice() {
      addAdvice(this.request_body.carNumber, this.request_body.items).then((res) => {
        var message = res.success
        if (message === true) {
          this.$router.push('/test/test1')
          this.$notify({title: '成功', message: '创建成功', type: 'success'})
        } else {
          this.$alert(this.message['data'], '创建失败', {confirmButtonText: '确定'})
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
