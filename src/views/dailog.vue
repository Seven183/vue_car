<template>

  <el-form-item>
    <el-button type="success" class="check_filter" icon="el-icon-plus" @click="open_dialog()">添加设备信息</el-button>
  </el-form-item>

  <el-form-item v-for="(filter,index) in request_body.items" :key="filter.id">
    设备类型:
    <el-select v-model="filter.advicesType" filterable allow-create clearable style="width: 240px">
      <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
    </el-select>
    设备名称:
    <el-input v-model="filter.advicesName" style="width: 240px"/>
    设备编号:
    <el-input v-model="filter.advicesNumber" style="width: 240px"/>
    <br>
    设备数量:
    <el-input v-model.number="filter.advicesQuantity" style="width: 240px" @input="advicesItemsFullAmount(index)"/>
    设备单价金额:
    <el-input v-model="filter.advicesPriceAmount" style="width: 240px" @input="advicesItemsFullAmount(index)"/>
    设备总金额:
    <el-input v-model="filter.advicesFullAmount" style="width: 240px"/>
    <el-button type="danger" icon="el-icon-delete" circle class="delete_icon" @click="delete_item(filter)"/>
    <br>
  </el-form-item>

  <el-form-item>
    <el-button v-if="createStatus" type="primary" @click="addAdvice">立即添加</el-button>
    <el-button v-if="!createStatus" type="primary" @click="updateAdvice">立即保存</el-button>
    <el-button @click="backHistory">返回</el-button>
  </el-form-item>
  </el-form>

  <el-dialog title="创建设备信息" :visible.sync="dialogVisible" width="27%" @close="add_item()">
    <el-form ref="advices_form" label-width="200px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
      <el-form-item label="设备类型" prop="advicesType">
        <el-select v-model="request_body.advicesType" filterable allow-create clearable style="width: 240px">
          <el-option v-for="item in metaDataList" :key="item.id" :label="item.value" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称" prop="advicesName">
        <el-input v-model="request_body.advicesName" placeholder="请输入设备名称" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="设备编号" prop="advicesNumber">
        <el-input v-model="request_body.advicesNumber" placeholder="请输入设备编号" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="设备数量" prop="advicesQuantity">
        <el-input v-model.number="request_body.advicesQuantity" placeholder="请输入设备数量" style="width: 240px"
                  @input="advicesFullAmount"/>
      </el-form-item>
      <el-form-item label="设备单价金额" prop="advicesPriceAmount">
        <el-input v-model="request_body.advicesPriceAmount" placeholder="请输入设备单价金额" style="width: 240px"
                  @input="advicesFullAmount"/>
      </el-form-item>
      <el-form-item label="设备总金额" prop="advicesFullAmount">
        <el-input v-model="request_body.advicesFullAmount" placeholder="请输入设备总金额" style="width: 240px"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "dailog"
}
</script>

<style scoped>

</style>
