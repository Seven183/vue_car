<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="member_form" label-width="200px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
        <el-form-item label="会员名" prop="memberName">
          <el-input v-model="request_body.memberName" placeholder="请输入会员名" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="会员性别" prop="memberSex">
          <el-select filterable allow-create clearable v-model="request_body.memberSex" style="width: 240px">
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="request_body.age" placeholder="请输入年龄" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="request_body.phone" placeholder="请输入电话或者手机号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="request_body.address" placeholder="请输入联系地址" style="width: 240px" type="textarea"/>
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeAmount">
          <el-input v-model="request_body.rechargeAmount" placeholder="请输入充值金额" style="width: 240px" @input="remainAmount"/>
        </el-form-item>
        <el-form-item label="车品牌" prop="carBrand">
          <el-select filterable allow-create clearable v-model="request_body.carBrand" style="width: 240px">
            <el-option v-for="item in carBrandMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车名称" prop="carName">
          <el-input v-model="request_body.carName" placeholder="请输入车名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="request_body.carNumber" placeholder="请输入车牌号" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="车架号" prop="engineNumber">
          <el-input v-model="request_body.engineNumber" placeholder="请输入车架号" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="createStatus" type="primary" @click="addMember">立即添加</el-button>
          <el-button v-if="!createStatus" type="primary" @click="updateMember">立即保存</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import {queryMetaDataByType} from '@/api/metaData';
import {addMember, selectMemberById, updateMember} from '@/api/member';

export default {
  name: 'AddMember',
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
      sexMetaDataType: 'SEX_TYPE',
      carBrandMetaDataType: 'CAR_BRAND_TYPE',
      sexMetaDataList: [],
      carBrandMetaDataList: [],
      createStatus: true,
      form_rules: {
        memberName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        memberSex: [{required: true, message: '性别不能为空', trigger: 'change'}],
        age: [{type: 'number', message: '年龄必须为整数', trigger: 'change'}],
        phone: [{required: true, message: '联系方式不能为空', trigger: 'change'}],
        rechargeAmount: [{validator: moneyReg, trigger: 'change'}],
        carBrand: [{required: true, message: '车品牌不能为空', trigger: 'blur'}],
        carName: [{required: true, message: '车名称不能为空', trigger: 'change'}],
        carNumber: [{required: true, message: '车牌号不能为空', trigger: 'change'}]
      },
      request_body: {
        memberName: null,
        memberSex: null,
        age: null,
        phone: null,
        address: null,
        rechargeAmount: null,
        remainAmount: null,
        carBrand: null,
        carName: null,
        carNumber: null,
        engineNumber: null
      }
    }
  },
  mounted() {
    const query = this.$route.query
    if (query.memberId) {
      this.createStatus = false
      selectMemberById(query.memberId).then((res) => {
        this.request_body = res.data
      })
    }
    queryMetaDataByType(this.sexMetaDataType).then((res) => {
      this.sexMetaDataList = res.data
    })
    queryMetaDataByType(this.carBrandMetaDataType).then((res) => {
      this.carBrandMetaDataList = res.data
    })
  },
  methods: {
    remainAmount() {
      this.request_body.remainAmount = this.request_body.rechargeAmount
    },
    updateMember() {
      this.$refs['member_form'].validate((valid) => {
        if (valid) {
          updateMember(this.request_body).then((res) => {
            this.$router.push('/member/allMembers')
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
          })
        }
      })
    },

    addMember() {
      this.$refs['member_form'].validate((valid) => {
        if (valid) {
          addMember(this.request_body).then((res) => {
            var message = res.success
            if (message === true) {
              this.$router.push('/member/allMembers')
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
