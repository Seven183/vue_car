<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="carsRepair_form" label-width=auto :rules="form_rules" :model="request_body" inline>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="request_body.userName" placeholder="请输入姓名" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="request_body.phone" placeholder="请输入电话或者手机号" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="request_body.carNumber" placeholder="请输入车牌号" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="车品牌" prop="carBrand">
          <el-select filterable allow-create v-model="request_body.carBrand" clearable style="width: 200px">
            <el-option v-for="item in carBrandMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车名称" prop="carName">
          <el-input v-model="request_body.carName" placeholder="请输入车名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="维修类型" prop="carsRepairType">
          <el-select filterable allow-create clearable v-model="request_body.carsRepairType" style="width: 200px">
            <el-option v-for="item in faultMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="维修内容" prop="carsRepairText">
          <el-input v-model="request_body.carsRepairText" placeholder="请输入维修内容" style="width: 200px"
                    type="textarea"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select filterable allow-create clearable placeholder="请输入性别" v-model="request_body.sex"
                     style="width: 200px">
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="request_body.age" placeholder="请输入年龄" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="request_body.address" placeholder="请输入联系地址" style="width: 200px" type="textarea"/>
        </el-form-item>
        <el-form-item label="车架号" prop="engineNumber">
          <el-input v-model="request_body.engineNumber" placeholder="请输入车架号" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="汽车图片">
          <el-upload
            :action="actionUrl"
            multiple
            :limit="5"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :on-progress="uploadPhoto"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传汽车图片</el-button>
            <div slot="tip" class="el-upload__tip">上传照片总大小不超过100M</div>
          </el-upload>
        </el-form-item>
        <el-form v-for="(filter,index) in request_body.advicesItems" :key="filter.id" label-width=auto :model="filter" inline>
          <el-divider></el-divider>
          <el-form-item label="设备类型" prop="advicesType" :rules="form_rules.advicesType">
            <el-select v-model="filter.advicesType" filterable allow-create clearable style="width: 200px">
              <el-option v-for="item in adviceMetaDataList" :key="item.id" :label="item.value" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="advicesName" :rules="form_rules.advicesName">
            <el-input v-model="filter.advicesName" placeholder="请输入设备名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="设备编号" prop="advicesNumber" :rules="form_rules.advicesNumber">
            <el-input v-model="filter.advicesNumber" placeholder="请输入设备编号" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="设备数量" prop="advicesQuantity" :rules="form_rules.advicesQuantity">
            <el-input v-model.number="filter.advicesQuantity" placeholder="请输入设备数量" style="width: 200px"
                      @input="advicesItemsFullAmount(index)"/>
          </el-form-item>
          <el-form-item label="设备单价金额" prop="advicesPriceAmount" :rules="form_rules.advicesPriceAmount">
            <el-input v-model="filter.advicesPriceAmount" placeholder="请输入设备单价金额" style="width: 200px"
                      @input="advicesItemsFullAmount(index)"/>
          </el-form-item>
          <el-form-item label="设备总金额">
            <el-input v-model="filter.advicesFullAmount" placeholder="请输入设备总金额"
                      style="width: 200px ;margin-right: 30px"/>
            <el-button type="danger" icon="el-icon-delete" circle class="delete_icon" @click="delete_item(filter)"/>
            <br><br>
          </el-form-item>
        </el-form>
        <div style="margin: 50px">
          <el-form-item>
            <el-button type="success" class="check_filter" icon="el-icon-plus" @click="add_item()">添加使用的工具</el-button>
            <el-button v-if="createStatus" type="primary" @click="addCarsRepair">新增本次维修记录</el-button>
            <el-button v-if="!createStatus" type="primary" @click="updateCarsRepair">更新本次维修记录</el-button>
            <el-button @click="backHistory">返回</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addCarsRepair, queryCarsRepairByCarsRepairNumber, queryCarsRepairById, updateCarsRepair} from '@/api/carsRepair'
import {queryMetaDataByType} from "@/api/metaData";
import {createUniqueString} from "@/utils";
import {fileDelete, fileUpload} from "@/api/fileUpload";
import * as uploadFiles from "core-js";

export default {
  name: 'AddCarsRepair',
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
      actionUrl: '',
      fileList: [],
      sexMetaDataType: 'SEX_TYPE',
      sexMetaDataList: [],
      carBrandMetaDataType: 'CAR_BRAND_TYPE',
      carBrandMetaDataList: [],
      faultMetaDataType: 'FAULT_TYPE',
      faultMetaDataList: [],
      adviceMetaDataType: 'ADVICE_TYPE',
      adviceMetaDataList: [],
      createStatus: true,
      form_rules: {
        userName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        phone: [{required: true, message: '联系方式不能为空', trigger: 'blur'}],
        carNumber: [{required: true, message: '车牌号不能为空', trigger: 'blur'}],
        carsRepairType: [{required: true, message: '维修类型不能为空', trigger: 'blur'}],
        driverName: [{required: true, message: '驾驶人姓名不能为空', trigger: 'blur'}],
        age: [{type: 'number', message: '年龄必须为数字', trigger: 'blur'}],
        carBrand: [{required: true, message: '车品牌不能为空', trigger: 'blur'}],
        carName: [{required: true, message: '车名称不能为空', trigger: 'blur'}],
        advicesQuantity: [{type: 'number', message: '设备数量为整数', trigger: 'blur'}],
        advicesPriceAmount: [{validator: moneyReg, trigger: 'blur'}]
      },
      request_body: {
        carNumber: null,
        carsRepairType: null,
        carsRepairText: null,
        username: null,
        phone: null,
        sex: null,
        age: null,
        address: null,
        photo: null,
        carBrand: null,
        carName: null,
        engineNumber: null,
        carPhoto: [],
        advicesItems: []
      }
    }
  },
  mounted() {
    if (process.env.VUE_APP_BASE_API === '/prod-api') {
      this.actionUrl = 'http://42.192.48.125' + process.env.VUE_APP_BASE_API + '/fileUpload'
    } else {
      this.actionUrl = 'http://localhost:9528' + process.env.VUE_APP_BASE_API + '/fileUpload'
    }
    const query = this.$route.query
    if (query.carsRepairNumber) {
      this.createStatus = false
      queryCarsRepairByCarsRepairNumber(query.carsRepairNumber).then((res) => {
        this.request_body = res.data
        this.fileList = res.data.carPhoto
      })
    }
    queryMetaDataByType(this.faultMetaDataType).then((res) => {
      this.faultMetaDataList = res.data
    })
    queryMetaDataByType(this.carBrandMetaDataType).then((res) => {
      this.carBrandMetaDataList = res.data
    })
    queryMetaDataByType(this.sexMetaDataType).then((res) => {
      this.sexMetaDataList = res.data
    })
    queryMetaDataByType(this.adviceMetaDataType).then((res) => {
      this.adviceMetaDataList = res.data
    })
  },
  methods: {
    // 图片上传前验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 100MB!')
      }
      return isLt2M
    },
    uploadPhoto(event, file, fileList) {
      const formData = new FormData()
      // this.fileList = fileList
      formData.append('file', file.raw)
      fileUpload(formData).then((res) => {
        const item = {
          name: file.name,
          url: res.data
        }
        this.request_body.carPhoto.push(item)
        console.log('this.request_body.carPhoto', this.request_body.carPhoto)
        console.log('fileList', fileList)
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制上传5个文件，已上传了 ${fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      fileDelete(file.name).then((res) => {
        if (res.data) {
          this.request_body.carPhoto = this.request_body.carPhoto.filter(x => x.name !== file.name)
          fileList.filter(x => x.name !== file.name)
          console.log('this.request_body.carPhoto', this.request_body.carPhoto)
          console.log('fileList', fileList)
          return 1
        }
      })
    },
    add_item() {
      const item = {
        id: createUniqueString(),
        advicesType: null,
        advicesName: null,
        advicesNumber: null,
        advicesQuantity: null,
        advicesPriceAmount: null,
        advicesFullAmount: null
      }
      this.request_body.advicesItems.push(item)
    },
    delete_item(filter) {
      this.request_body.advicesItems = this.request_body.advicesItems.filter(item => item.id !== filter.id)
    },
    advicesItemsFullAmount(index) {
      this.request_body.advicesItems[index].advicesFullAmount = this.request_body.advicesItems[index].advicesQuantity * this.request_body.advicesItems[index].advicesPriceAmount
    },
    updateCarsRepair() {
      this.$refs['carsRepair_form'].validate((valid) => {
        if (valid) {
          updateCarsRepair(this.request_body).then((res) => {
            this.$router.push('/carsRepair/allCarsRepairs')
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
            if (message === true) {
              this.$router.push('/carsRepair/allCarsRepairs')
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
  padding: 100px
}

.el-form-item__content {
  width: 200px
}

.demo-ruleForm .el-input__inner {
  width: 0
}
</style>
