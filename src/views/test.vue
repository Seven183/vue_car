<template>
  <el-card>
    <div slot="header">
      发送切药指令
    </div>
    <el-row>
      <el-col :span="12">
        <div v-for="(v,i) in SmallPackageAdjustDrugSlotVos">
          槽位编号：
          <el-input style="width: 100px" :inline="true" v-model="SmallPackageAdjustDrugSlotVos[i].slotNo"
                    placeholder="请输入槽位编号"></el-input>;
          药品数量：
          <el-input style="width: 100px" :inline="true" v-model="SmallPackageAdjustDrugSlotVos[i].quantity"
                    placeholder="请输入药品数量"></el-input>
          <el-button type="danger" size="small" @click="del(i)">删除</el-button>
          <el-button type="success" size="small" @click="addItem()">新增</el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'test',
  data() {
    return {
      SmallPackageAdjustDrugSlotVos: [{
        slotNo: '',
        quantity: 1
      }],
    }
  },
  methods: {
    addItem() {
      let i = this.count;
      if (i < 6) {
        this.SmallPackageAdjustDrugSlotVos.push({slotNo: '', quantity: 1})
        this.count++;
      } else {
        this.msgError('最多发送6组切药指令')
      }
    },
    // 删除一行切药指令
    del(i) {
      if (i == 0) {
        return;
      } else {
        this.SmallPackageAdjustDrugSlotVos.splice(i, 1)
      }
    },
  }

}
</script>

<style scoped>
</style>
