<template>
  <div class="app-container">
    <div class="app-header" style="width: 80%;">
      <el-select
        v-model="queryParams.memberName"
        filterable
        allow-create
        placeholder="会员名"
        clearable
        style="width: 15%;margin: 5px;"
        @keyup.enter.native="getList"
        @clear="getList"
        @input="getList"
      >
        <el-option v-for="item in memberUserList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.phone"
        filterable
        allow-create
        placeholder="联系方式"
        clearable
        style="width: 15%;margin: 5px;"
        @keyup.enter.native="getList"
        @clear="getList"
        @input="getList"
      >
        <el-option v-for="item in memberPhoneList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.carNumber"
        filterable
        allow-create
        placeholder="车牌号"
        clearable
        style="width: 15%;margin: 5px;"
        @keyup.enter.native="getList"
        @clear="getList"
        @input="getList"
      >
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="queryParams.carBrand"
        filterable
        allow-create
        placeholder="车品牌"
        clearable
        style="width: 15%;margin-right: 5px;"
        @input="getList"
        @keyup.enter.native="getList"
        @clear="getList"
      >
        <el-option v-for="item in carBrandList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="success" icon="el-icon-edit" @click="add()">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="memberName" label="会员名" align="center" />
        <el-table-column prop="carNumber" label="车牌号" align="center" />
        <el-table-column prop="memberSex" label="会员性别" align="center" />
        <el-table-column prop="age" label="年龄" align="center" />
        <el-table-column prop="phone" label="联系方式" align="center" />
        <el-table-column prop="address" label="联系地址" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="updateTime" label="更新时间" align="center" />
        <el-table-column :label="$t('table.actions')" align="center" min-width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" style="min-width: 50px" @click="details(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" style="min-width: 50px;margin-right: 10px" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteMember(scope.row)">
              <el-button slot="reference" type="danger" size="mini" style="min-width: 40px">删除</el-button>
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
    <el-dialog center title="会员详细信息" top="10vh" :visible.sync="dialogVisible">
      <!--      <pre>{{ this.detailsMessage }}</pre>-->
      <div align="center">
        <el-descriptions title="基本信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="会员名">{{ this.detailsMessage.memberName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ this.detailsMessage.memberSex }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ this.detailsMessage.age }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ this.detailsMessage.phone }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ this.detailsMessage.address }}</el-descriptions-item>
          <el-descriptions-item label="会员照片">{{ this.detailsMessage.photo }}</el-descriptions-item>
          <el-descriptions-item label="充值金额">{{ this.detailsMessage.rechargeAmount }}</el-descriptions-item>
          <el-descriptions-item label="剩余金额">{{ this.detailsMessage.remainAmount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ this.detailsMessage.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ this.detailsMessage.updateTime }}</el-descriptions-item>
        </el-descriptions><br><br>
        <el-descriptions title="车辆信息" class="margin-top" :column="2" border>
          <el-descriptions-item label="车牌号">{{ this.detailsMessage.carNumber }}</el-descriptions-item>
          <el-descriptions-item label="汽车品牌">{{ this.detailsMessage.carBrand }}</el-descriptions-item>
          <el-descriptions-item label="汽车名称">{{ this.detailsMessage.carName }}</el-descriptions-item>
          <el-descriptions-item label="车架号">{{ this.detailsMessage.engineNumber }}</el-descriptions-item>
          <el-descriptions-item label="汽车图片">{{ this.detailsMessage.carPhoto }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog center :title=title top="10vh" :visible.sync="memberDialogVisible">
      <el-form ref="member_form" label-width="200px" :rules="form_rules" :model="request_body" inline>
        <el-form-item label="会员名" prop="memberName">
          <el-input v-model="request_body.memberName" placeholder="请输入会员名" style="width: 240px" />
        </el-form-item>
        <el-form-item label="会员性别" prop="memberSex">
          <el-select v-model="request_body.memberSex" filterable allow-create clearable style="width: 240px">
            <el-option v-for="item in sexMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="request_body.age" placeholder="请输入年龄" style="width: 240px" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="request_body.phone" placeholder="请输入电话或者手机号" style="width: 240px" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="request_body.address" placeholder="请输入联系地址" style="width: 240px" type="textarea" />
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeAmount">
          <el-input v-model="request_body.rechargeAmount" placeholder="请输入充值金额" style="width: 240px" @input="remainAmount" />
        </el-form-item>
        <el-form-item label="车品牌" prop="carBrand">
          <el-select v-model="request_body.carBrand" filterable allow-create clearable style="width: 240px">
            <el-option v-for="item in carBrandMetaDataList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="车名称" prop="carName">
          <el-input v-model="request_body.carName" placeholder="请输入车名称" style="width: 240px" />
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="request_body.carNumber" placeholder="请输入车牌号" style="width: 240px" />
        </el-form-item>
        <el-form-item label="车架号" prop="engineNumber">
          <el-input v-model="request_body.engineNumber" placeholder="请输入车架号" style="width: 240px" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button v-if="addMemberDialogVisible" type="primary" @click="addMember">立即添加</el-button>
        <el-button v-if="updateMemberDialogVisible" type="primary" @click="updateMember">立即更新</el-button>
        <el-button type="primary" @click="cancel()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {
  addMember,
  allMember,
  deleteMember,
  selectCarBrands,
  selectCarNumbers, selectMemberById,
  selectMemberPhones,
  selectMemberUsers, updateMember
} from '@/api/member'
import {queryMetaDataByType} from '@/api/metaData'

export default {
  name: 'ListMemberDialog',
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
    const age = (rule, value, callback) => {
      setTimeout(() => {
        if (!/^\d+[.]?$/.test(value) && value) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }, 500)
    }
    return {
      list: [],
      total: 0,
      sexMetaDataType: 'SEX_TYPE',
      carBrandMetaDataType: 'CAR_BRAND_TYPE',
      carNumberList: [],
      carBrandList: [],
      memberPhoneList: [],
      memberUserList: [],
      sexMetaDataList: [],
      carBrandMetaDataList: [],
      title: '添加会员信息',
      dialogVisible: false,
      memberDialogVisible: false,
      addMemberDialogVisible: false,
      updateMemberDialogVisible: false,
      detailsMessage: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberName: null,
        carNumber: null,
        memberSex: null,
        phone: null,
        address: null
      },
      form_rules: {
        memberName: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        memberSex: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        phone: [{ required: true, message: '联系方式不能为空', trigger: 'change' }],
        carBrand: [{ required: true, message: '车品牌不能为空', trigger: 'change' }],
        carName: [{ required: true, message: '车名称不能为空', trigger: 'change' }],
        carNumber: [{ required: true, message: '车牌号不能为空', trigger: 'change' }],
        rechargeAmount: [{ validator: moneyReg, trigger: 'change' }],
        age: [{ validator: age, trigger: 'change' }]
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
    selectMemberPhones().then((res) => {
      this.memberPhoneList = res.data
    })
    selectMemberUsers().then((res) => {
      this.memberUserList = res.data
    })
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      allMember(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allMember(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allMember(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    remainAmount() {
      this.request_body.remainAmount = this.request_body.rechargeAmount
    },
    edit(row) {
      this.title = '更新会员信息'
      selectMemberById(row.memberId).then((res) => {
        this.request_body = res.data
        if (res.success === true) {
          this.memberDialogVisible = true
          this.addMemberDialogVisible = false
          this.updateMemberDialogVisible = true
        }
      })
    },
    updateMember() {
      this.$refs['member_form'].validate((valid) => {
        if (valid) {
          updateMember(this.request_body).then((res) => {
            this.memberDialogVisible = false
            this.$router.go(0)
            this.$notify({ title: '成功', message: '更新成功', type: 'success' })
          })
        }
      })
    },
    deleteMember(row) {
      deleteMember(row.memberId).then(res => {
        this.getList()
        this.$notify({ title: '成功', message: '删除成功', type: 'success' })
      })
    },
    add() {
      this.title = '添加会员信息'
      this.request_body = {}
      this.memberDialogVisible = true
      this.addMemberDialogVisible = true
      this.updateMemberDialogVisible = false
      this.$refs['member_form'].resetFields()
    },
    addMember() {
      this.$refs['member_form'].validate((valid) => {
        if (valid) {
          addMember(this.request_body).then((res) => {
            this.memberDialogVisible = false
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
    details(row) {
      this.dialogVisible = true
      this.detailsMessage = row
    },
    cancel() {
      this.memberDialogVisible = false
      this.request_body = {}
    }
  }
}
</script>

<style>
  .app-container {
    padding: 50px;
    background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
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
