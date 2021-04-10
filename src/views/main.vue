<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="height:48px;lineHeight:48px">
      <a-row type="flex">
        <div class="logo-box">
          <!-- <img class="logo" src="../assets/main/logo.png" alt="logo" /> -->
        </div>
        <head-menu class="head-menu" />
        <a-dropdown class="avaterName">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            <a-avatar style="backgroundColor:#87d068" icon="user"
              size="small" />
            {{userInfo.username}}
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="resetPsw">
                <a-icon type="retweet" /><span class="menu-text">修改密码</span>
              </a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="logoutHandle">
                <a-icon type="logout" /><span class="menu-text">退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-row>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model="collapsed" collapsible
        :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, backgroundColor:'#fff' }">
        <template slot="trigger">
          <a-icon class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
        </template>
        <left-menu></left-menu>
      </a-layout-sider>
      <a-layout-content :style="{left: collapsed? '80px': '200px'}">
        <right-main></right-main>
        <a-modal title="修改密码" :visible="showEditPswModal"
          :confirm-loading="isEditPsw" @ok="editConfirm" @cancel="editCancel"
          :width="500">
          <a-form-model ref="editPswRef" :model="editPswForm"
            :rules="editPswFormRules" :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }">
            <a-form-model-item label="原密码" prop="pwd_old" ref="pwd_old">
              <a-input-password v-model="editPswForm.pwd_old" placeholder="请输入"
                @blur="
          () => {
            $refs.pwd_old.onFieldBlur()
          }
        " />
            </a-form-model-item>
            <a-form-model-item label="新密码" prop="pwd_new" ref="pwd_new">
              <a-input-password v-model="editPswForm.pwd_new" placeholder="请输入"
                @blur="
          () => {
            $refs.pwd_new.onFieldBlur()
          }
        " />
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </a-layout-content>
    </a-layout>
    <a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import { logout, editPsw } from '@/api/user.js'
import { SHA256 } from '@/js/crypt.js'
import HeadMenu from "@/components/home/HeadMenu.vue"
import LeftMenu from "@/components/home/LeftMenu.vue"
import RightMain from "@/components/home/RightMain.vue"
import { mapGetters } from 'vuex'
const editPswForm = {
  user_id: '',
  pwd_old: '',
  pwd_new: ''
}
export default {
  data () {
    return {
      collapsed: false,
      showEditPswModal: false,
      isEditPsw: false,
      editPswForm: { ...editPswForm },
      editPswFormRules: {
        pwd_old: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        pwd_new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
      }
    }
  },
  components: {
    HeadMenu,
    LeftMenu,
    RightMain
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo/userInfo'
    })
  },
  methods: {
    logoutHandle () {
      let that = this
      this.$confirm({
        title: '注销',
        content: '您确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk () {
          that.logout()
        },
        onCancel () { }
      })
    },
    logout () {
      logout({}).then(res => {
        this.$store.commit('resetAllData')
        this.$router.replace({ name: 'login' })
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    resetPsw () {
      this.showEditPswModal = true
      this.editPswForm = Object.assign(this.editPswForm, {
        user_id: this.userInfo.user_id
      })
    },
    editConfirm () {
      this.isEditPsw = true
      const pwd_old = SHA256(this.editPswForm.pwd_old)
      const pwd_new = SHA256(this.editPswForm.pwd_new)
      const data = {
        user_id: this.editPswForm.user_id,
        pwd_old,
        pwd_new
      }
      editPsw(data).then(res => {
        this.$message.success('修改成功')
        this.editCancel()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    editCancel () {
      this.editPswForm = Object.assign({}, editPswForm)
      this.showEditPswModal = false
      this.isEditPsw = false
    }
  }
}
</script>
<style lang="less" scoped>
.login-footer {
  margin: 48px 0 24px;
  padding: 0 16px;
  text-align: center;
}

.logo-box {
  height: 48px;
  line-height: 48px;
  width: 180px;
  background: #001529;
  .logo {
    float: left;
    height: 32px;
    margin: 8px;
  }
}
.head-menu {
  flex: 1;
}
.ant-layout-header {
  padding: 0 20px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.ant-layout-content {
  position: absolute;
  right: 0;
  top: 48px;
  bottom: 0;
  overflow-y: auto;
}
/deep/ .ant-layout-sider-trigger {
  text-align: left;
  padding: 0 20px;
  background-color: #fff;
  border: 1px solid #fafafa;
  i {
    color: #161414;
  }
}
.menu-text {
  margin-left: 20px;
}
</style>