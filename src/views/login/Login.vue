<template>
  <a-layout class="login">
    <a-layout-content class="login-content">
      <div id="login" class="login-main">
        <div class="logo">
          <img alt="logo" height="50" width="150"
            src="../../assets/login/logo.png" />
        </div>
        <!-- <div>
          <a href="http://192.168.0.103:7000/login" target="_self"
            class="title">MMC</a>
        </div> -->
        <div class="subTitle">专业药品管理中心信息平台</div>
        <!-- <div class="subTitle">MMC药品管理中心</div> -->
        <a-form :form="loginForm" @submit="loginSubmit" labelAlign="left"
          class="login-tab">
          <a-form-item>
            <a-input
              v-decorator="[ 'userName', { rules: [{ required: true, message: '请输入用户名' }] }]"
              placeholder="请输入用户名">
              <a-icon slot="prefix" type="user"
                style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password
              v-decorator="[ 'password',  { rules: [{ required: true, message: '请输入密码' }] } ]"
              type="password" placeholder="请输入密码">
              <a-icon slot="prefix" type="lock"
                style="color: rgba(0,0,0,.25)" />
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <!-- <a-row type="flex" justify="space-between">
              <a-checkbox
                v-decorator="[ 'remember', { valuePropName: 'checked', initialValue: true}]">
                记住密码
              </a-checkbox>
              <a class="login-forgot" href="">
                忘记密码
              </a>
            </a-row> -->
            <a-button type="primary" html-type="submit" class="login-button"
              :loading="isLogin">
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-layout-content>
    <a-layout-footer>
      <div class="login-footer">
        Copyright
        <a-icon type="copyright" />
        城市映急
      </div>
    </a-layout-footer>
  </a-layout>
</template>
<script>
import { isMobile } from '@/js/utils.js'
// import { testBigscreen } from '@/api/user'
import { login, user_auth, userAuth } from '@/api/user.js'
import { SHA256 } from '@/js/crypt.js'
import { mapGetters, mapMutations } from 'vuex';
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
let index = 0
export default {
  data () {
    return {
      activeKey: '1',
      hasErrors,
      loginForm: this.$form.createForm(this, { name: 'login_form' }),
      registerForm: this.$form.createForm(this, { name: 'register_form' }),
      isLogin: false,
      value: '',
      dataSource: [],
      busy: false
    }
  },
  computed: {
    ...mapGetters({
      currentRouter: 'userInfo/currentRouter'
    })
  },
  created () {
    for (let i = 0; i < 10; i++) {
      this.dataSource.push({ name: index++ })
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'userInfo/setUserInfo',
      setModuleList: 'userInfo/setModuleList',
      setCurrentModule: 'userInfo/setCurrentModule',
      setPageAuthList: 'userInfo/setPageAuthList'
    }),
    checkPhone (rule, value, callback) {
      if (isMobile(value)) {
        callback()
      } else {
        callback('请正确输入手机号码！')
      }
    },
    userNameError () {
      const { getFieldError, isFieldTouched } = this.loginForm
      return isFieldTouched('userName') && getFieldError('userName')
    },
    passwordError () {
      const { getFieldError, isFieldTouched } = this.loginForm
      return isFieldTouched('password') && getFieldError('password')
    },
    loginSubmit (e) {
      e.preventDefault();
      // testBigscreen({}).then(res => { })
      this.loginForm.validateFields((err, values) => {
        if (!err) {
          this.isLogin = true
          let { userName, password } = values
          password = SHA256(password)
          login({ login_name: userName, pwd: password }).then(res => {
            this.setUserInfo(res)
            user_auth({}).then(authRes => {
              //权限处理
              let authList = []
              authRes.page_auth_list.forEach(item => {
                authList = authList.concat(item.page_list)
              });
              this.setPageAuthList(authList)
              //模块处理
              let list = []
              authRes.moudle_list.forEach(item => {
                list = list.concat(item.childrens)
              });
              this.setModuleList(list)
              this.setCurrentModule(list[0].id)

              this.$router.push({ name: this.currentRouter })
              this.isLogin = false
            }).catch(authErr => {
              this.$message.error(authErr.msg)
              this.isLogin = false
            })
            this.isLogin = false
          }).catch(err => {
            this.$message.error(err.msg)
            this.isLogin = false
          })
        }
      });
    },
    registerSubmit (e) {
      e.preventDefault();
      this.registerForm.validateFields((err, values) => {
        if (!err) {
          this.register(values)
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  text-align: center;
  .login-content {
    background-image: url(../../assets/login/bg.svg);
  }
}
.login-main {
  width: 320px;
  margin: 30px auto;
  .title {
    color: #000;
    font-size: 30px;
    font-weight: 600;
  }
  .subTitle {
    margin-top: 20px;
    margin-bottom: 40px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  /deep/ .ant-input {
    height: 40px;
  }
}
.login-forgot {
  float: right;
}
.login-button {
  width: 100%;
}
</style>