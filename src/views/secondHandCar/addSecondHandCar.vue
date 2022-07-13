<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="secondHandCar_form" label-width="auto" :rules="form_rules" :model="request_body" inline>
        <el-form-item label="买家姓名" prop="buyerUser">
          <el-input v-model="request_body.buyerUser" placeholder="请输入买家姓名" style="width: 200px" />
        </el-form-item>
        <el-form-item label="买家身份证号" prop="buyerIdCard">
          <el-input v-model="request_body.buyerIdCard" placeholder="请输入买家身份证号" style="width: 200px" />
        </el-form-item>
        <el-form-item label="买家手机号" prop="buyerPhone">
          <el-input v-model.number="request_body.buyerPhone" placeholder="请输入买家手机号" style="width: 200px" />
        </el-form-item>
        <el-form-item label="买家年龄" prop="buyerAge">
          <el-input v-model.number="request_body.buyerAge" placeholder="请输入买家年龄" style="width: 200px" />
        </el-form-item>
        <el-form-item label="买家性别" prop="buyerSex">
          <el-select
            v-model="request_body.buyerSex"
            filterable
            allow-create
            clearable
            placeholder="请输入买家性别"
            style="width: 200px">
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="买家地址" prop="buyerAddress">
          <el-input v-model="request_body.buyerAddress" placeholder="请输入买家地址" style="width: 200px" type="textarea"/>
        </el-form-item>
        <el-form-item label="卖家姓名" prop="sellerUser">
          <el-input
            v-model="request_body.sellerUser"
            placeholder="请输入卖家姓名"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卖家身份证号" prop="sellerIdCard">
          <el-input
            v-model="request_body.sellerIdCard"
            placeholder="请输入卖家身份证号"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卖家手机号" prop="sellerPhone">
          <el-input
            v-model.number="request_body.sellerPhone"
            placeholder="请输入卖家手机号"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卖家年龄" prop="sellerAge">
          <el-input
            v-model.number="request_body.sellerAge"
            placeholder="请输入卖家年龄"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卖家性别" prop="sellerSex">
          <el-select
            v-model="request_body.sellerSex"
            filterable
            allow-create
            clearable
            placeholder="请输入卖家性别"
            style="width: 200px"
          >
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="卖家地址" prop="sellerAddress">
          <el-input
            v-model="request_body.sellerAddress"
            placeholder="请输入卖家地址"
            style="width: 200px"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="二手车车牌" prop="secondHandCarNumber">
          <el-input
            v-model="request_body.secondHandCarNumber"
            placeholder="请输入二手车车牌"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="二手车金额" prop="secondHandCarAmount">
          <el-input
            v-model="request_body.secondHandCarAmount"
            placeholder="请输入二手车金额"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="二手车品牌" prop="secondHandCarBrand">
          <el-select
            v-model="request_body.secondHandCarBrand"
            filterable
            allow-create
            clearable
            placeholder="请输入二手车品牌"
            style="width: 200px">
            <el-option v-for="item in carBrandMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="二手车名称" prop="secondHandCarName">
          <el-input
            v-model="request_body.secondHandCarName"
            placeholder="请输入二手车名称"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="二手车车架号" prop="secondHandCarEngineNumber">
          <el-input
            v-model="request_body.secondHandCarEngineNumber"
            placeholder="请输入二手车车架号"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="二手车图片">
          <el-upload
            :action="actionUrl"
            multiple
            :limit="5"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :on-progress="uploadPhoto"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传汽车图片</el-button>
            <div slot="tip" class="el-upload__tip">上传照片总大小不超过100M</div>
          </el-upload>
        </el-form-item>
        <div style="margin: 50px">
          <el-form-item>
            <el-button v-if="createStatus" type="primary" @click="addSecondHandCar">新增二手车记录</el-button>
            <el-button v-if="!createStatus" type="primary" @click="updateSecondHandCar">更新二手车记录</el-button>
            <el-button @click="backHistory">返回</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { queryMetaDataByType } from '@/api/metaData'
import { fileDelete, fileUpload } from '@/api/fileUpload'
import { addSecondHandCar, selectSecondHandCarById, updateSecondHandCar } from '@/api/secondHandCar'

export default {
  name: 'AddSecondHandCar',
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
      createStatus: true,
      form_rules: {
        buyerUser: [{ required: true, message: '买家姓名不能为空', trigger: 'blur' }],
        buyerIdCard: [{ required: true, message: '买家身份证号不能为空', trigger: 'blur' }],
        buyerPhone: [{ required: true, message: '买家手机号不能为空', trigger: 'blur' }],
        secondHandCarNumber: [{ required: true, message: '二手车车牌号不能为空', trigger: 'blur' }],
        secondHandCarBrand: [{ required: true, message: '二手车品牌不能为空', trigger: 'blur' }],
        secondHandCarAmount: [{ validator: moneyReg, trigger: 'blur', required: true }]
      },
      request_body: {
        buyerUser: null,
        buyerIdCard: null,
        buyerPhone: null,
        buyerAge: null,
        buyerSex: null,
        buyerAddress: null,
        sellerUser: null,
        sellerIdCard: null,
        sellerPhone: null,
        sellerAge: null,
        sellerSex: null,
        sellerAddress: null,
        secondHandCarAmount: null,
        secondHandCarBrand: null,
        secondHandCarNumber: null,
        secondHandCarName: null,
        secondHandCarEngineNumber: null,
        carPhoto: []
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
    if (query.secondHandCarId) {
      this.createStatus = false
      selectSecondHandCarById(query.secondHandCarId).then((res) => {
        this.request_body = res.data
        this.fileList = res.data.carPhoto
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
          return 1
        }
      })
    },
    updateSecondHandCar() {
      this.$refs['secondHandCar_form'].validate((valid) => {
        if (valid) {
          updateSecondHandCar(this.request_body).then((res) => {
            this.$router.push('/secondHandCar/allSecondHandCar')
            this.$notify({ title: '成功', message: '更新成功', type: 'success' })
          })
        }
      })
    },

    addSecondHandCar() {
      this.$refs['secondHandCar_form'].validate((valid) => {
        if (valid) {
          addSecondHandCar(this.request_body).then((res) => {
            if (res.success === true) {
              this.$router.push('/secondHandCar/allSecondHandCar')
              this.$notify({ title: '成功', message: '创建成功', type: 'success' })
            } else {
              this.$alert(this.message['data'], '创建失败', { confirmButtonText: '确定' })
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
