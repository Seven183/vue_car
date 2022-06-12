<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="carsRepair_form" label-width="100px" :rules="form_rules" :model="request_body"
               class="demo-ruleForm">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="request_body.userName" placeholder="请输入姓名" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="request_body.phone" placeholder="请输入电话或者手机号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="request_body.carNumber" placeholder="请输入车牌号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="维修类型" prop="carsRepairType">
          <el-input v-model="request_body.carsRepairType" placeholder="请输入维修类型" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="维修内容" prop="carsRepairText">
          <el-input v-model="request_body.carsRepairText" placeholder="请输入维修内容" style="width: 240px" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="createStatus" type="primary" @click="addCarsRepair">立即添加</el-button>
          <el-button v-if="!createStatus" type="primary" @click="updateCarsRepair">立即保存</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addCarsRepair, queryCarsRepairById, updateCarsRepair} from '@/api/carsRepair'

export default {
  name: 'AddCarsRepair',
  created() {
    const query = this.$route.query
    if (query.carsRepairId) {
      this.createStatus = false
      this.carsRepairId = query.carsRepairId
      this.queryCarsRepairById(this.carsRepairId)
    }
  },
  data() {
    return {
      carsRepairId: '',
      createStatus: true,
      form_rules: {
        userName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        phone: [{required: true, message: '联系方式不能为空', trigger: 'change'}],
        carNumber: [{required: true, message: '车牌号不能为空', trigger: 'change'}],
        carsRepairType: [{required: true, message: '维修类型不能为空', trigger: 'change'}]
      },
      request_body: {
        username: null,
        phone: null,
        carNumber: null,
        carsRepairType: null,
        carsRepairText: null
      }
    }
  },
  methods: {
    queryCarsRepairById() {
      queryCarsRepairById(this.carsRepairId).then((res) => {
        this.request_body = res.data
      })
    },
    updateCarsRepair() {
      this.$refs['carsRepair_form'].validate((valid) => {
        if (valid) {
          updateCarsRepair(this.request_body).then((res) => {
            this.$router.push('/carsRepair/allCarsRepair')
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },

    addCarsRepair() {
      this.$refs['carsRepair_form'].validate((valid) => {
        if (valid) {
          addCarsRepair(this.request_body).then((res) => {
            var message = res.success
            console.log(message)
            if (message === true) {
              this.$router.push('/carsRepair/allCarsRepair')
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
