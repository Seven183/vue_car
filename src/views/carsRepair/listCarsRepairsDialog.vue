<template>
  <div class="app-container">
    <div class="app-header">
      <el-input
        v-model="queryParams.phone"
        placeholder="手机号"
        clearable
        style="width: 10%;margin-right: 5px;"
        @keyup.enter.native="getList"
        @clear="getList"
        @input="getList"
      />
      <el-select
        v-model="queryParams.carNumber"
        filterable
        allow-create
        placeholder="车牌号"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.carsRepairType"
        filterable
        allow-create
        placeholder="维修类型"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in faultMetaDataList" :key="item.id" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.status"
        filterable
        allow-create
        placeholder="维修状态"
        clearable
        style="width: 10%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in carRepairStatusMetaDataList" :key="item.id" :label="item.code" :value="item.value" />
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
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="add">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="userName" label="姓名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="carNumber" label="车牌号" align="center" />
        <el-table-column prop="carsRepairType" label="维修类型" align="center" />
        <el-table-column prop="carsRepairText" label="维修内容" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="维修时间" align="center" sortable />
        <el-table-column prop="status" label="维修状态" align="center" sortable>
          <template slot-scope="scope">
            <el-tag v-for="item in status_list" v-if="item.key === scope.row.status" :type="item.type">
              {{ item.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px;" @click="detailsByCarsRepairNumber(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" style="min-width: 50px; margin-right: 10px" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteCarsRepair(scope.row)">
              <el-button slot="reference" type="danger" size="mini" style="min-width: 40px; margin-right: 10px">删除</el-button>
            </el-popconfirm>
            <el-popconfirm title="确定已经完成了吗？" @confirm="statusOperate(scope.row, 1)">
              <el-button slot="reference" type="success" size="mini" style="min-width: 40px">是否完成</el-button>
            </el-popconfirm>
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
    <el-dialog center title="车辆维修详细信息" top="5vh" :visible.sync="dialogVisible">
      <!--      <pre>{{ this.detailsMessage }}</pre>-->
      <div align="center">
        <el-descriptions title="基本信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="姓名">{{ this.detailsMessage.userName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.sex }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.age }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ this.detailsMessage.phone }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ this.detailsMessage.address }}</el-descriptions-item>
          <el-descriptions-item label="用户照片">{{ this.detailsMessage.userPhoto }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ this.detailsMessage.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ this.detailsMessage.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ this.detailsMessage.endTime }}</el-descriptions-item>
        </el-descriptions>
        <br><br>
        <el-descriptions title="车辆信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="车牌号">{{ this.detailsMessage.carNumber }}</el-descriptions-item>
          <el-descriptions-item label="汽车品牌">{{ this.detailsMessage.carBrand }}</el-descriptions-item>
          <el-descriptions-item label="汽车名称">{{ this.detailsMessage.carName }}</el-descriptions-item>
          <el-descriptions-item label="车架号">{{ this.detailsMessage.engineNumber }}</el-descriptions-item>
          <el-descriptions-item label="汽车图片">{{ this.detailsMessageImagesUrl }}</el-descriptions-item>
        </el-descriptions>
        <br><br>
        <el-descriptions title="设备信息" />
        <el-table :data="this.detailsMessage.advicesItems">
          <el-table-column property="advicesType" label="设备类型" width="170" />
          <el-table-column property="advicesName" label="设备名称" width="170" />
          <el-table-column property="advicesNumber" label="设备编号" width="170" />
          <el-table-column property="advicesQuantity" label="设备数量" width="160" />
          <el-table-column property="advicesPriceAmount" label="设备单价金额" width="170" />
          <el-table-column property="advicesFullAmount" label="设备总金额" width="170" />
        </el-table>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog center :title="title" top="5vh" :visible.sync="carsRepairDialogVisible">
      <el-form ref="carsRepair_form" label-width="auto" :rules="form_rules" :model="request_body" inline>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="request_body.userName" placeholder="请输入姓名" style="width: 200px" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="request_body.phone" placeholder="请输入电话或者手机号" style="width: 200px" />
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="request_body.carNumber" placeholder="请输入车牌号" style="width: 200px" />
        </el-form-item>
        <el-form-item label="车品牌" prop="carBrand">
          <el-select v-model="request_body.carBrand" filterable allow-create clearable style="width: 200px">
            <el-option v-for="item in carBrandMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="车名称" prop="carName">
          <el-input v-model="request_body.carName" placeholder="请输入车名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="维修类型" prop="carsRepairType">
          <el-select v-model="request_body.carsRepairType" filterable allow-create clearable style="width: 200px">
            <el-option v-for="item in faultMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="维修内容" prop="carsRepairText">
          <el-input
            v-model="request_body.carsRepairText"
            placeholder="请输入维修内容"
            style="width: 200px"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="request_body.sex"
            filterable
            allow-create
            clearable
            placeholder="请输入性别"
            style="width: 200px"
          >
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="request_body.age" placeholder="请输入年龄" style="width: 200px" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="request_body.address" placeholder="请输入联系地址" style="width: 200px" type="textarea" />
        </el-form-item>
        <el-form-item label="车架号" prop="engineNumber">
          <el-input v-model="request_body.engineNumber" placeholder="请输入车架号" style="width: 200px" />
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
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传汽车图片</el-button>
            <div slot="tip" class="el-upload__tip">上传照片总大小不超过100M</div>
          </el-upload>
        </el-form-item>
        <el-form v-for="(filter,index) in request_body.advicesItems" :key="filter.id" label-width="auto" :model="filter" inline>
          <el-divider />
          <el-form-item label="设备类型" prop="advicesType" :rules="form_rules.advicesType">
            <el-select v-model="filter.advicesType" filterable allow-create clearable style="width: 200px">
              <el-option v-for="item in adviceMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="advicesName" :rules="form_rules.advicesName">
            <el-input v-model="filter.advicesName" placeholder="请输入设备名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="设备编号" prop="advicesNumber" :rules="form_rules.advicesNumber">
            <el-input v-model="filter.advicesNumber" placeholder="请输入设备编号" style="width: 200px" />
          </el-form-item>
          <el-form-item label="设备数量" prop="advicesQuantity" :rules="form_rules.advicesQuantity">
            <el-input
              v-model.number="filter.advicesQuantity"
              placeholder="请输入设备数量"
              style="width: 200px"
              @input="advicesItemsFullAmount(index)"
            />
          </el-form-item>
          <el-form-item label="设备单价金额" prop="advicesPriceAmount" :rules="form_rules.advicesPriceAmount">
            <el-input
              v-model="filter.advicesPriceAmount"
              placeholder="请输入设备单价金额"
              style="width: 200px"
              @input="advicesItemsFullAmount(index)"
            />
          </el-form-item>
          <el-form-item label="设备总金额">
            <el-input
              v-model="filter.advicesFullAmount"
              placeholder="请输入设备总金额"
              style="width: 200px ;margin-right: 30px"
            />
            <el-button type="danger" icon="el-icon-delete" circle class="delete_icon" @click="delete_item(filter)" />
            <br><br>
          </el-form-item>
        </el-form>
      </el-form>
      <span slot="footer">
        <el-button type="success" class="check_filter" icon="el-icon-plus" @click="add_item()">添加使用的工具</el-button>
        <el-button v-if="addCarsRepairDialogVisible" type="primary" @click="addCarsRepair">新增本次维修记录</el-button>
        <el-button v-if="updateCarsRepairDialogVisible" type="primary" @click="updateCarsRepair">更新本次维修记录</el-button>
        <el-button @click="cancel">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addCarsRepair,
  deleteCarsRepair,
  detailsByCarsRepairNumber,
  queryAllCarsRepair, queryCarsRepairByCarsRepairNumber,
  selectCarNumbers,
  statusOperate, updateCarsRepair
} from '@/api/carsRepair'
import { queryMetaDataByType } from '@/api/metaData'
import { fileDelete, fileUpload } from '@/api/fileUpload'
import { createUniqueString } from '@/utils'

export default {
  name: 'ListCarsRepairsDialog',
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
      title: '添加车辆维修信息',
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
      carRepairStatusMetaDataList: [],
      carRepairStatusMetaDataType: 'CARREPAIR_STATUS_TYPE',
      carNumberList: [],
      status_list: [
        { key: 0, value: '维修中', type: 'warn' },
        { key: 1, value: '维修完成', type: 'success' }
      ],
      detailsMessage: '',
      detailsMessageImagesUrl: '',
      dialogVisible: false,
      carsRepairDialogVisible: false,
      addCarsRepairDialogVisible: false,
      updateCarsRepairDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phone: null,
        status: null,
        carNumber: null,
        startCreateTime: null,
        endCreateTime: null
      },
      form_rules: {
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        carNumber: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
        carsRepairType: [{ required: true, message: '维修类型不能为空', trigger: 'blur' }],
        carBrand: [{ required: true, message: '车品牌不能为空', trigger: 'blur' }],
        carName: [{ required: true, message: '车名称不能为空', trigger: 'blur' }],
        age: [{ type: 'number', message: '年龄必须为数字', trigger: 'blur' }],
        advicesQuantity: [{ type: 'number', message: '设备数量为整数', trigger: 'blur' }],
        advicesPriceAmount: [{ validator: moneyReg, trigger: 'blur' }]
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
    queryMetaDataByType(this.carRepairStatusMetaDataType).then((res) => {
      this.carRepairStatusMetaDataList = res.data
    })
    selectCarNumbers().then((res) => {
      this.carNumberList = res.data
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
          this.carsRepairDialogVisible = false
          updateCarsRepair(this.request_body).then((res) => {
            this.$router.go(0)
            this.$notify({ title: '成功', message: '更新成功', type: 'success' })
          })
        }
      })
    },
    addCarsRepair() {
      this.$refs['carsRepair_form'].validate((valid) => {
        if (valid) {
          this.carsRepairDialogVisible = false
          addCarsRepair(this.request_body).then((res) => {
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
      this.title = '更新车辆维修信息'
      queryCarsRepairByCarsRepairNumber(row.carsRepairNumber).then((res) => {
        if (res.success === true) {
          this.request_body = res.data
          this.fileList = res.data.carPhoto
          this.carsRepairDialogVisible = true
          this.addCarsRepairDialogVisible = false
          this.updateCarsRepairDialogVisible = true
        }
      })
    },
    add() {
      this.title = '添加车辆维修信息'
      this.carsRepairDialogVisible = true
      this.addCarsRepairDialogVisible = true
      this.updateCarsRepairDialogVisible = false
      this.fileList = []
      this.request_body.advicesItems = []
      this.$refs['carsRepair_form'].resetFields()
      console.log(this.request_body)
    },
    handleFilter() {
      this.getList()
    },
    getList() {
      queryAllCarsRepair(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      queryAllCarsRepair(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      queryAllCarsRepair(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    deleteCarsRepair(row) {
      deleteCarsRepair(row.carsRepairNumber).then(res => {
        this.getList()
        this.$notify({ title: '成功', message: '删除成功', type: 'success' })
      })
    },
    statusOperate(row, status) {
      statusOperate(row.carsRepairNumber, status).then(res => {
        this.getList()
        this.$notify({ title: '成功', message: '已完成', type: 'success' })
      })
    },
    detailsByCarsRepairNumber(row) {
      this.dialogVisible = true
      detailsByCarsRepairNumber(row.carsRepairNumber).then(res => {
        this.detailsMessage = res.data
        this.detailsMessageImagesUrl = res.data.carPhoto.map(x => x.url)
      })
    },
    cancel() {
      this.carsRepairDialogVisible = false
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
