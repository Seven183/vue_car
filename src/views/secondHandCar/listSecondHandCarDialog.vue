<template>
  <div class="app-container">
    <div class="app-header">
      <el-select
        v-model="queryParams.buyerUser"
        filterable
        allow-create
        placeholder="买家姓名"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in buyerUserList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.buyerIdCard"
        filterable
        allow-create
        placeholder="买家身份证号"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in buyerIdCardList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.buyerPhone"
        filterable
        allow-create
        placeholder="买家手机号"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in buyerPhoneList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.secondHandCarNumber"
        filterable
        allow-create
        placeholder="二手车车牌号"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.secondHandCarBrand"
        filterable
        allow-create
        placeholder="二手车品牌"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in carBrandList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="queryParams.startCreateTime"
        align="right"
        style="width: 10%;margin: 5px;"
        type="date"
        placeholder="开始日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @input="getList"
        @clear="getList"
        @keyup.enter.native="getList"
      />
      <el-date-picker
        v-model="queryParams.endCreateTime"
        align="right"
        style="width: 10%;margin: 5px;"
        type="date"
        placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @input="getList"
        @clear="getList"
        @keyup.enter.native="getList"
      />
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="success" icon="el-icon-edit" @click="add">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="buyerUser" label="买家姓名" align="center" />
        <el-table-column prop="buyerIdCard" label="买家身份证号" align="center" />
        <el-table-column prop="buyerPhone" label="买家手机号" align="center" />
        <el-table-column prop="sellerUser" label="卖家姓名" align="center" />
        <el-table-column prop="sellerPhone" label="卖家手机号" align="center" />
        <el-table-column prop="secondHandCarNumber" label="二手车车牌号" align="center" />
        <el-table-column prop="secondHandCarBrand" label="二手车品牌" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" sortable />

        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px;" @click="selectSecondHandCarById(scope.row)">详情</el-button>
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
        @size-change="getListByPage"
      />
    </div>
    <el-dialog center title="二手车详细信息" top="5vh" :visible.sync="dialogVisible">
      <!--      <pre>{{ this.detailsMessage }}</pre>-->
      <div align="center">
        <el-descriptions title="买家基本信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="姓名">{{ this.detailsMessage.buyerUser }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ this.detailsMessage.buyerIdCard }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ this.detailsMessage.buyerPhone }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.buyerAge }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.userPhoto }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ this.detailsMessage.buyerAddress }}</el-descriptions-item>
        </el-descriptions>
        <br><br>
        <el-descriptions title="卖家基本信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="姓名">{{ this.detailsMessage.sellerUser }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ this.detailsMessage.sellerIdCard }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ this.detailsMessage.sellerPhone }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.sellerAge }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.sellerSex }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ this.detailsMessage.sellerAddress }}</el-descriptions-item>
        </el-descriptions>
        <br><br>
        <el-descriptions title="车辆信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="二手车车牌号">{{ this.detailsMessage.secondHandCarNumber }}</el-descriptions-item>
          <el-descriptions-item label="二手车品牌">{{ this.detailsMessage.secondHandCarBrand }}</el-descriptions-item>
          <el-descriptions-item label="二手车名称">{{ this.detailsMessage.secondHandCarName }}</el-descriptions-item>
          <el-descriptions-item label="二手车车架号">{{ this.detailsMessage.secondHandCarEngineNumber }}</el-descriptions-item>
          <el-descriptions-item label="二手车图片">{{ this.detailsMessageImagesUrl }}</el-descriptions-item>
          <el-descriptions-item label="二手车金额">{{ this.detailsMessage.secondHandCarAmount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ this.detailsMessage.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ this.detailsMessage.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog center :title="title" top="5vh" :visible.sync="secondHandCarDialogVisible">
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
            style="width: 200px"
          >
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="买家地址" prop="buyerAddress">
          <el-input v-model="request_body.buyerAddress" placeholder="请输入买家地址" style="width: 200px" type="textarea" />
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
            style="width: 200px"
          >
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
      </el-form>
      <span slot="footer">
        <el-button v-if="addSecondHandCarDialogVisible" type="primary" @click="addSecondHandCar">新增二手车记录</el-button>
        <el-button v-if="updateSecondHandCarDialogVisible" type="primary" @click="updateSecondHandCar">更新二手车记录</el-button>
        <el-button type="primary" @click="cancel">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {
  addSecondHandCar,
  allSecondHandCar,
  deleteSecondHandCar, selectBuyerIdCards, selectBuyerPhones, selectBuyerUsers, selectCarBrands,
  selectCarNumbers,
  selectSecondHandCarById, updateSecondHandCar
} from '@/api/secondHandCar'
import { queryMetaDataByType } from '@/api/metaData'
import { fileDelete, fileUpload } from '@/api/fileUpload'

export default {
  name: 'ListSecondHandCarDialog',
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
      actionUrl: '',
      fileList: [],
      sexMetaDataType: 'SEX_TYPE',
      sexMetaDataList: [],
      carBrandMetaDataType: 'CAR_BRAND_TYPE',
      carBrandMetaDataList: [],
      list: [],
      total: 0,
      carBrandList: [],
      carNumberList: [],
      buyerPhoneList: [],
      buyerUserList: [],
      buyerIdCardList: [],
      detailsMessage: '',
      detailsMessageImagesUrl: '',
      dialogVisible: false,
      title: '添加二手车信息',
      secondHandCarDialogVisible: false,
      addSecondHandCarDialogVisible: false,
      updateSecondHandCarDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        buyerUser: null,
        buyerPhone: null,
        buyerIdCard: null,
        secondHandCarBrand: null,
        secondHandCarNumber: null,
        startCreateTime: null,
        endCreateTime: null
      },
      form_rules: {
        buyerUser: [{ required: true, message: '买家姓名不能为空', trigger: 'blur' }],
        buyerIdCard: [{ required: true, message: '买家身份证号不能为空', trigger: 'blur' }],
        buyerPhone: [{ required: true, message: '买家手机号不能为空', trigger: 'blur' }],
        secondHandCarNumber: [{ required: true, message: '二手车车牌号不能为空', trigger: 'blur' }],
        secondHandCarBrand: [{ required: true, message: '二手车品牌不能为空', trigger: 'blur' }],
        secondHandCarAmount: [{ required: true, message: '二手车金额不能为空', trigger: 'blur'}, { validator: moneyReg}]
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
    queryMetaDataByType(this.sexMetaDataType).then((res) => {
      this.sexMetaDataList = res.data
    })
    queryMetaDataByType(this.carBrandMetaDataType).then((res) => {
      this.carBrandMetaDataList = res.data
    })
    selectCarNumbers().then((res) => {
      this.carNumberList = res.data
    })
    selectCarBrands().then((res) => {
      this.carBrandList = res.data
    })
    selectBuyerPhones().then((res) => {
      this.buyerPhoneList = res.data
    })
    selectBuyerUsers().then((res) => {
      this.buyerUserList = res.data
    })
    selectBuyerIdCards().then((res) => {
      this.buyerIdCardList = res.data
    })
    this.getList()
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
    handleFilter() {
      this.getList()
    },
    getList() {
      allSecondHandCar(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allSecondHandCar(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allSecondHandCar(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateSecondHandCar() {
      this.$refs['secondHandCar_form'].validate((valid) => {
        if (valid) {
          this.secondHandCarDialogVisible = false
          this.$refs['secondHandCar_form'].resetFields()
          this.fileList = []
          updateSecondHandCar(this.request_body).then((res) => {
            this.$router.go(0)
            this.$notify({ title: '成功', message: '更新成功', type: 'success' })
          })
        }
      })
    },
    addSecondHandCar() {
      this.$refs['secondHandCar_form'].validate((valid) => {
        if (valid) {
          addSecondHandCar(this.request_body).then((res) => {
            this.secondHandCarDialogVisible = false
            if (res.success === true) {
              this.getList()
              this.$notify({ title: '成功', message: '创建成功', type: 'success' })
            } else {
              this.$alert(this.message['data'], '创建失败', { confirmButtonText: '确定' })
            }
          })
        }
      })
    },
    edit(row) {
      this.title = '更新二手车信息'
      selectSecondHandCarById(row.secondHandCarId).then((res) => {
        if (res.success === true) {
          this.request_body = res.data
          this.fileList = res.data.carPhoto
          this.secondHandCarDialogVisible = true
          this.addSecondHandCarDialogVisible = false
          this.updateSecondHandCarDialogVisible = true
        }
      })
    },
    add() {
      this.title = '添加二手车信息'
      this.secondHandCarDialogVisible = true
      this.addSecondHandCarDialogVisible = true
      this.updateSecondHandCarDialogVisible = false
      this.fileList = []
      this.$refs['secondHandCar_form'].resetFields()
    },
    deleteSecondHandCar(row) {
      deleteSecondHandCar(row.carsRepairNumber).then(res => {
        this.getList()
        this.$notify({ title: '成功', message: '删除成功', type: 'success' })
      })
    },
    selectSecondHandCarById(row) {
      this.dialogVisible = true
      selectSecondHandCarById(row.secondHandCarId).then(res => {
        this.detailsMessage = res.data
        this.detailsMessageImagesUrl = res.data.carPhoto.map(x => x.url)
      })
    },
    cancel() {
      this.secondHandCarDialogVisible = false
      this.$router.go(0)
    }
  }
}
</script>

<style>
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
