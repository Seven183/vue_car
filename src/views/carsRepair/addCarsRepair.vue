<template>
  <div class="create">
    <div class="create-body">
      <el-form ref="job_form" label-width="100px" :rules="form_rules" :model="request_body" class="demo-ruleForm">
        <el-form-item label="任务名称" prop="job_name">
          <el-input
            v-model="request_body.job_name"
            placeholder="请输入调度名称"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="项目类别" prop="project_code">
          <el-select
            v-model="request_body.project_code"
            clearable
            filterable
            remote
            placeholder="请选择项目类别"
            :remote-method="getProjectList"
          >
            <el-option
              v-for="item in projects"
              :key="item.project_name"
              :label="item.project_name"
              :value="item.project_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调度规则" prop="rule_code">
          <el-select
            v-model="request_body.rule_code"
            clearable
            filterable
            remote
            placeholder="请选择调度的任务"
            :remote-method="getRuleList"
          >
            <el-option
              v-for="item in rules"
              :key="item.rule_code"
              :label="item.rule_name"
              :value="item.rule_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="createStatus">
          <el-button type="primary" @click="add">立即创建</el-button>
          <el-button @click="backHistory">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddCarsRepair',
  data() {
    return {
      createStatus: true,
      rules: [],
      projects: [],
      form_rules: {

        job_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        project_code: [{ required: true, message: '项目类别不能为空', trigger: 'change' }],
        rule_code: [{ required: true, message: '调度任务不能为空', trigger: 'change' }]
      },
      triggers: [
        { name: '指定时间执行', trigger: 'date' },
        { name: '间隔执行', trigger: 'interval' },
        { name: 'cron调度器', trigger: 'cron' }
      ],
      interval: [
        { name: '间隔几天', type: 'days' },
        { name: '间隔几小时', type: 'hours' },
        { name: '间隔几分钟', type: 'minutes' },
        { name: '间隔多少秒', type: 'seconds' }
      ],
      project_code: null,
      job_id: null,
      interval_type: null,
      interval_value: null,
      source_type: null,
      test: { id: 1, name: '123' },
      tableStatus: true,
      fieldStatus: true,
      key_value: null,
      ruleForm: {},
      disables: {
        table: true,
        field: true
      },
      value1: null,
      request_body: {
        project_code: null,
        rule_code: null,
        job_name: null,
        trigger: null,
        run_date: null,
        start_date: null,
        end_date: null,
        year: null,
        month: null,
        day: null,
        day_of_week: null,
        hour: null,
        minute: 0,
        second: 0,
        status: 1
      }
    }
  },
  created() {
    let query = this.$route.query
    if (query.job_id) {
      this.job_id = query.job_id
      this.createStatus = false
      this.jobInfo()
    } else {
      this.request_body.rule_type = query.rule_type
    }
    queryTimely({ 'page_size': 30 }).then((res) => {
      this.rules = res.data.list
    })
    queryProject({ 'page_size': 30 }).then((res) => {
      this.projects = res.data.list
    })
  },
  methods: {
    getProjectList(project_name) {
      queryProject({ 'project_name': project_name }).then((res) => {
        this.projects = res.data.list
      })
    },
    jobInfo() {
      getJob(this.job_id).then((res) => {
        this.request_body = res.data
      })
    },
    getRuleList(rule_name) {
      queryTimely({ 'rule_name': rule_name }).then((res) => {
        this.rules = res.data.list
      })
    },
    add() {
      this.$refs['job_form'].validate((valid) => {
        if (valid) {
          if (this.request_body.trigger === 'interval') {
            if (this.interval_type === 'days') {
              this.request_body.day = this.interval_value
            } else if (this.interval_type === 'hours') {
              this.request_body.hour = this.interval_value
            } else if (this.interval_type === 'minutes') {
              this.request_body.minute = this.interval_value
            } else if (this.interval_type === 'seconds') {
              this.request_body.second = this.interval_value
            }
          }
          addJob(this.request_body)
            .then((res) => {
              var message = res.success
              console.log(message)
              if (message === true) {
                this.$router.push('/job/list')
                this.$notify({
                  title: '成功',
                  message: '创建规则成功',
                  type: 'success'
                })
              } else {
                this.$alert(this.message['data'], '创建失败', {
                  confirmButtonText: '确定'
                })
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
.create .create-body {
  padding: 50px 20px
}

.el-form-item__content {
  width: 250px
}
.demo-ruleForm .el-input__inner {
  width: 0
}
</style>
