<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>去首页</el-dropdown-item>
          </router-link>
          <!--          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">-->
          <!--            <el-dropdown-item>Github</el-dropdown-item>-->
          <!--          </a>-->
          <!--          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
          <!--            <el-dropdown-item>Docs</el-dropdown-item>-->
          <!--          </a>-->
          <el-dropdown-item divided @click.native="updatePwd()">
            <span style="display:block;">更改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="更改密码" :visible.sync="dialogVisible" width="30%" destroy-on-close @before-close="clearPwd">
      <el-form label-width="200px" :rules="passRules" :model="passForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" clearable show-password placeholder="原密码" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="更新密码" prop="updatePassword">
          <el-input v-model="passForm.updatePassword" clearable show-password placeholder="更新密码" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" clearable show-password placeholder="确认密码" style="width: 240px"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="clearPwd">取 消</el-button>
        <el-button type="primary" @click="updatePass()">立即更新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {selectUserByUserId, updateUser} from '@/api/user';
import {removeToken} from '@/utils/auth';

export default {
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (value !== this.password) {
        callback(new Error('原密码输入错误'))
      } else {
        callback()
      }
    }
    const validateUpdatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        if (value === this.password) {
          callback(new Error('新密码与原密码输入一样'))
        } else {
          callback()
        }
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        if (value !== this.passForm.updatePassword) {
          callback(new Error('确认密码与新密码输入不一样'))
        } else {
          callback()
        }
      }
    }
    return {
      dialogVisible: false,
      detailsMessage: '',
      password: '',
      passForm: {
        oldPassword: '',
        updatePassword: '',
        newPassword: ''
      },
      passRules: {
        oldPassword: [{required: true, trigger: 'blur', validator: validateOldPassword}],
        updatePassword: [{required: true, trigger: 'blur', validator: validateUpdatePassword}],
        newPassword: [{required: true, trigger: 'blur', validator: validateNewPassword}]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    selectUserByUserId(this.$store.state.user.userId).then(res => {
      this.password = res.data.pwd
    })
  },
  methods: {
    updatePass() {
      this.dialogVisible = false
      updateUser({ userId: this.$store.state.user.userId, pwd: this.passForm.updatePassword }).then(res => {
        if (res.success === true) {
          this.$notify({title: '成功', message: '更新密码成功', type: 'success'})
          removeToken()
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        } else {
          this.$alert(this.message['data'], '创建失败', {confirmButtonText: '确定'})
        }
      })
    },
    clearPwd() {
      this.passForm.oldPassword = ''
      this.passForm.updatePassword = ''
      this.passForm.newPassword = ''
      this.dialogVisible = false
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    updatePwd() {
      this.dialogVisible = true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
