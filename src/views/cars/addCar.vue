<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="car_form" label-width="200px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
        <el-form-item label="车品牌" prop="carBrand">
          <el-select filterable allow-create clearable v-model="request_body.carBrand" style="width: 240px">
            <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车名称" prop="carName">
          <el-input v-model="request_body.carName" placeholder="请输入车名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-select filterable allow-create clearable placeholder="请输入车牌号" v-model="request_body.carNumber"
                     style="width: 240px">
            <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车架号" prop="engineNumber">
          <el-input v-model="request_body.engineNumber" placeholder="请输入车架号" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="createStatus" type="primary" @click="addCar">立即添加</el-button>
          <el-button v-if="!createStatus" type="primary" @click="updateCar">立即保存</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import {queryMetaDataByType} from '@/api/metaData';
import {addCar, selectCarById, updateCar} from "@/api/cars";
import {selectCarNumbers} from "@/api/carsRepair";

export default {
  name: 'AddCar',
  data() {
    return {
      carNumberList: [],
      metaDataType: 'CAR_BRAND_TYPE',
      metaDataList: [],
      createStatus: true,
      form_rules: {
        carBrand: [{required: true, message: '车品牌不能为空', trigger: 'blur'}],
        carName: [{required: true, message: '车名称不能为空', trigger: 'change'}],
        carNumber: [{required: true, message: '车牌号不能为空', trigger: 'change'}]
      },
      request_body: {
        carBrand: null,
        carName: null,
        carNumber: null,
        engineNumber: null
      }
    }
  },
  mounted() {
    const query = this.$route.query
    if (query.carId) {
      this.createStatus = false
      selectCarById(query.carId).then((res) => {
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
    updateCar() {
      this.$refs['car_form'].validate((valid) => {
        if (valid) {
          updateCar(this.request_body).then((res) => {
            this.$router.push('/car/allCars')
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },

    addCar() {
      this.$refs['car_form'].validate((valid) => {
        if (valid) {
          addCar(this.request_body).then((res) => {
            var message = res.success
            if (message === true) {
              this.$router.push('/car/allCars')
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
