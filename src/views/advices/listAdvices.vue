<template>
  <div class="app-container" >
    <div class="app-header">
      <el-input v-model="queryParams.advicesType" placeholder="设备类型" clearable style="width: 200px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-input v-model="queryParams.advicesName" placeholder="设备名称" clearable style="width: 200px;margin-right: 5px;"
                @keyup.enter.native="getList"
                @clear="getList"
                @input="getList"/>
      <el-input v-model="queryParams.advicesNumber" placeholder="设备编号" clearable style="width: 200px;margin: 5px;"
                @input="getList"
                @keyup.enter.native="getList"
                @clear="getList"/>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-search" @click="getList">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin: 5px;" type="primary" icon="el-icon-edit" @click="addAdvice">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <div class="app-body">
      <el-table :data="list" stripe fit border highlight-current-row>
        <el-table-column prop="advicesType" label="设备类型" width="200" align="center"></el-table-column>
        <el-table-column prop="advicesName" label="设备名称" width="200" align="center"></el-table-column>
        <el-table-column prop="advicesNumber" label="设备编号" width="200" align="center"></el-table-column>
        <el-table-column prop="advicesQuantity" label="设备数量" width="200" align="center"></el-table-column>
        <el-table-column prop="advicesPriceAmount" label="设备单价金额" width="300" align="center" sortable></el-table-column>
        <el-table-column prop="advicesFullAmount" label="设备总金额" width="240" align="center" sortable></el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" min-width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="min-width: 50px" @click="updateAdvice(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteAdvice(scope.row)">
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
import {allAdvices, deleteAdvice} from "@/api/advices";

export default {
  name: 'ListAdvices',
  data() {
    return {
      list: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        advicesType: null,
        advicesName: null,
        advicesNumber: null
      },
      request_body: {
        advicesType: null,
        advicesName: null,
        advicesNumber: null,
        advicesQuantity: null,
        advicesPriceAmount: null,
        advicesFullAmount: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      allAdvices(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByPage(size) {
      this.queryParams.pageSize = size
      allAdvices(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    getListByNumber(number) {
      this.queryParams.pageNum = number
      allAdvices(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    updateAdvice(row) {
      console.log('dasdasda', row)
      this.$router.push({
        path: '/advice/addAdvice',
        query: {
          advicesId: row.advicesId
        }
      })
    },
    deleteAdvice(row) {
      deleteAdvice(row.advicesId).then(res => {
        this.getList()
        this.$notify({title: '成功', message: '删除成功', type: 'success'})
      })
    },
    addAdvice() {
      this.$router.push('/advice/addAdvice')
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
