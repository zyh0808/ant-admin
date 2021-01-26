<template>
  <div id="login" class="login-main">
    <a-tabs default-active-key="1" class="login-tabs">
      <a-tab-pane key="1" tab="登录">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" @submit="handleSubmit"
          labelAlign="left" class="login-tab">
          <a-form-item label="用户名">
            <a-input v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '请输入用户名!' }],
                },
              ]" placeholder="用户名">
              <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码!' }],
                },
              ]" type="password" placeholder="密码">
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-button type="primary" html-type="submit" class="login-btn">
            登录
          </a-button>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="注册"> Content of Tab Pane 2 </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data () {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' })
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   // To disabled submit button at the beginning.
    //   this.form.validateFields();
    // });
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    // Only show error after a field is touched.
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('username') && getFieldError('username');
    },
    // Only show error after a field is touched.
    passwordError () {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('password') && getFieldError('password');
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          // this.$router.push({ name: "home" })
          this.login(values)
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
  .login-tabs {
    position: absolute;
    width: 400px;
    top: 200px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .login-btn {
      width: 100%;
    }
  }
}
</style>