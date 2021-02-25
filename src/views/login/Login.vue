<template>
  <div id="login" class="login-main">
    <a-tabs v-model="activeKey" default-active-key="1" class="login-tabs">
      <a-tab-pane key="1" tab="登录">
        <a-form :form="loginForm" @submit="loginSubmit" labelAlign="left"
          class="login-tab">
          <!-- <a-form-item label="用户名">
            <a-input v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '请输入用户名!' }],
                },
              ]" placeholder="用户名">
              <a-icon slot="prefix" type="user"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码!' }],
                },
              ]" type="password" placeholder="密码">
              <a-icon slot="prefix" type="lock"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item> -->
          <!-- <a-button type="primary" html-type="submit" class="login-btn">
            登录
          </a-button> -->
          <a-form-item>
            <a-input
              v-decorator="[ 'userName', { rules: [{ required: true, message: '请输入用户名!' }] }]"
              placeholder="用户名">
              <a-icon slot="prefix" type="user"
                style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[ 'password',  { rules: [{ required: true, message: '请输入密码!' }] } ]"
              type="password" placeholder="密码">
              <a-icon slot="prefix" type="lock"
                style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[ 'remember', { valuePropName: 'checked', initialValue: true}]">
              记住密码
            </a-checkbox>
            <a class="login-forgot" href="">
              忘记密码
            </a>
            <a-button type="primary" html-type="submit" class="login-button">
              登录
            </a-button>
            或
            <a @click="activeKey = '2'">现在注册！</a>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="注册">
        <a-form :form="registerForm" :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }" @submit="registerSubmit" labelAlign="left"
          class="register-tab">
          <a-form-item label="用户名">
            <a-input v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '请输入用户名!' }],
                },
              ]" placeholder="用户名">
              <a-icon slot="prefix" type="user"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码!' }],
                },
              ]" type="password" placeholder="密码">
              <a-icon slot="prefix" type="lock"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item label="密码确认">
            <a-input v-decorator="[
                'passwordConfirm',
                {
                  rules: [{ required: true, message: '请再次输入密码!' }],
                },
              ]" type="password" placeholder="密码">
              <a-icon slot="prefix" type="lock"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-decorator="['email',
                {
                  rules: [
                  { type: 'email', message: '请输入正确的邮箱地址!'},
                  { required: true, message: '请输入邮箱地址!' }],
                }
              ]" type="email" placeholder="邮箱">
              <a-icon slot="prefix" type="mail"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input v-decorator="[
                'phone',
                {
                  rules: [
                  {validator: checkPhone},
                  { required: true, message: '请输入手机号码!' }],
                }
              ]" placeholder="手机号码">
              <a-icon slot="prefix" type="mobile"
                style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-button type="primary" html-type="submit" class="register-btn">
            注册
          </a-button>
          <p class="goto-login">已有账号，前往<a @click="activeKey = '1'">登录</a></p>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { isMobile } from '@/js/utils.js'
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data () {
    return {
      activeKey: '1',
      hasErrors,
      loginForm: this.$form.createForm(this, { name: 'login_form' }),
      registerForm: this.$form.createForm(this, { name: 'register_form' })
    }
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      register: 'user/register'
    }),
    checkPhone (rule, value, callback) {
      if (isMobile(value)) {
        callback()
      } else {
        callback('请正确输入手机号码！')
      }
    },
    // Only show error after a field is touched.
    userNameError () {
      const { getFieldError, isFieldTouched } = this.loginForm;
      return isFieldTouched('username') && getFieldError('username');
    },
    // Only show error after a field is touched.
    passwordError () {
      const { getFieldError, isFieldTouched } = this.loginForm;
      return isFieldTouched('password') && getFieldError('password');
    },
    loginSubmit (e) {
      e.preventDefault();
      this.loginForm.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          this.login(values)
          this.$router.push({ name: "drugDetail" })
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

<style lang="scss" scoped>
.login-main {
  width: 100%;
  height: 100%;
  color: #fff;
  background-image: url('../../assets/bg.jpg');
  .login-tabs {
    position: absolute;
    width: 440px;
    top: 200px;
    left: 0;
    right: 0;
    margin: auto;
    padding: 0 20px;
    background-color: #fff;
    opacity: 0.8;
    border-radius: 6px;
    .register-btn {
      width: 100%;
    }
    .goto-login {
      margin-top: 5px;
      float: right;
    }
  }
}
.login-forgot {
  float: right;
}
.login-button {
  width: 100%;
}
</style>