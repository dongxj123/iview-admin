<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录浙江华数容灾平台" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
// import { constants } from 'crypto'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        debugger
        if (res.code === 0) {
          localStorage.removeItem('tagNaveList')
          // this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
          // })
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
