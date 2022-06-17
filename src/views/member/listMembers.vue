<template>
  <div class="app-container">
    <div class="app-header" style="width: 80%;">
      <el-input filterable allow-create v-model="queryParams.memberName" placeholder="会员名" clearable style="width: 15%;margin-right: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-select filterable allow-create v-model="queryParams.carNumber" placeholder="车牌号" clearable
                 style="width: 15%;margin: 5px;"
                 @keyup.enter.native="getList"
                 @clear="getList"
                 @input="getList">
        <el-option v-for="item in carNumberList" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-input v-model="queryParams.phone" placeholder="联系方式" clearable style="width: 15%;margin: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
<!--      <el-select filterable allow-create v-model="queryParams.memberSex" placeholder="会员性别" clearable-->
<!--                 style="width: 15%;margin: 5px;"-->
<!--                 @keyup.enter.native="getList"-->
<!--                 @clear="getList"-->
<!--                 @input="getList">-->
<!--        <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>-->
<!--      </el-select>-->
<!--      <el-input v-model="queryParams.address" placeholder="联系地址" clearable style="width: 15%;margin: 5px;"-->
<!--                @input="getList"-->
<!--                @keyup.enter.native="getList"-->
<!--                @clear="getList"/>-->
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addMember">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="memberName" label="会员名" align="center"></el-table-column>
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="memberSex" label="会员性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
        <el-table-column prop="address" label="联系地址" align="center"></el-table-column>
        <el-table-column prop="rechargeAmount" label="充值金额 (元)" align="center" sortable></el-table-column>
        <el-table-column prop="remainAmount" label="剩余金额 (元)" align="center" sortable></el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="min-width: 50px;margin-right: 10px" @click="updateMember(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteMember(scope.row)">
              <el-button type="danger" size="mini" style="min-width: 40px" slot="reference">删除</el-button>
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
        @size-change="getListByPage"/>
    </div>
  </div>
</template>
<script>

import {allMember, deleteMember, selectCarNumbers} from '@/api/member'
import {queryMetaDataByType} from '@/api/metaData'

export default {
  name: 'ListMember',
  data() {
    return {
      list: [],
      total: 0,
      carNumberList: [],
      metaDataList: [],
      metaDataType: 'SEX_TYPE',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberName: null,
        carNumber: null,
        memberSex: null,
        phone: null,
        address: null
      }
    }
  },
  mounted() {
    queryMetaDataByType(this.metaDataType).then((res) => {
      this.metaDataList = res.data
    })
    selectCarNumbers().then((res) => {
      this.carNumberList = res.data
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
    updateMember(row) {
      this.$router.push({
        path: '/member/addMember',
        query: {
          memberId: row.memberId
        }
      })
    },
    deleteMember(row) {
      console.log(row)
      deleteMember(row.memberId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    addMember() {
      this.$router.push('/member/addMember')
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
