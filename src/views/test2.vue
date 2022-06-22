<template>
  <div class="ing-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card shadow="hover">
          <div slot="header">
            <span>添加考勤活动</span>
          </div>
          <div class="lodash-content">
            <i
              class="el-icon-plus avatar-uploader-icon"
              @click="dialogVisible = true"
            ></i>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="创建课程" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
        <el-form-item label="考勤活动名称" prop="title">
          <el-input v-model.trim="addForm.title" autocomplete="off" style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="课程班级" prop="cClass">
          <el-select v-model="addForm.cClass" placeholder="请选择" style="width:350px">
            <el-option
              v-for="item in cClassList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考勤时间">
          <el-time-picker
            is-range
            v-model="addForm.time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="获取定位" prop="location">
          <el-switch v-model="addForm.location"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'test2',
  data() {
    return {
      dialogVisible: false,
      cClassList: [
        {
          value: 1,
          label: '软件1701Java程序设计',
        },
        {
          value: 2,
          label: '软件1702Java程序设计',
        },
        {
          value: 3,
          label: '软件1703C语言',
        },
        {
          value: 4,
          label: '蓝盾1701Android系统',
        },
        {
          value: 5,
          label: '蓝盾1702网络安全',
        },
      ],
      addForm: {
        title: '',
        cClass: 1,
        location: false,
        options: [],
        value: [],
        list: [],
        loading: false,
        time: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      },
      rules: {
        title: [{required: true, trigger: 'blur', message: '请输入标题'}],
        author: [{required: true, trigger: 'blur', message: '请输入作者'}],
      },
    }
  },
  mounted() {
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {
        })
    }
  }
}
</script>

<style scoped>
.ing-container {
  text-align: left;
}

::v-deep {
  .lodash-content {
    min-height: 150px;
  }
}

.avatar-uploader-icon {
  font-size: 30px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: right;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>
