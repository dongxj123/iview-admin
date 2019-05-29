<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
       <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem>当前用户：{{username.username}}</DropdownItem>
        <DropdownItem name="menuManager" v-show="username.is_superuser">
            <!-- <Icon type="md-settings"></Icon> -->
            菜单管理
        </DropdownItem>
        <DropdownItem name="userManager" v-show="username.is_superuser">
            用户管理
        </DropdownItem>
        <DropdownItem name="changePassword">
            修改密码
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal
        v-model="modal1"
        title="修改密码"
        >
            <Form ref="formArg" :model="formArg" :rules="ruleformArg" :label-width="120">
                <FormItem label="旧密码：" prop="old_password">
                    <Input type="password" v-model="formArg.old_password" placeholder="请输入旧密码：..."></Input>
                </FormItem>
                <FormItem label="确认旧密码：" prop="check_password">
                    <Input type="password" v-model="formArg.check_password" placeholder="请再次输入旧密码：..."></Input>
                </FormItem>
                <FormItem label="新密码：" prop="new_password">
                    <Input type="password" v-model="formArg.new_password" placeholder="请输入新密码：..."></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="ok">添加</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { getUserName } from '@/libs/util'
import {
  changePassword
} from '@/api/routers'
export default {
  data () {
    return {
      modal1: false,
      formArg: {
        old_password: '',
        check_password: '',
        new_password: ''
      },
      ruleformArg: {
        old_password: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        check_password: [
          { validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('请再次输入密码'))
            } else if (value !== this.formArg.old_password) {
              return callback(new Error('两次密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur' }
        ],
        new_password: [
          { required: true, trigger: 'blur' },
          { min: 6, message: '请输入最少6位' }
        ]
      },
      username: JSON.parse(getUserName())

    }
  },
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    menuManager () {
      this.$router.push({ path: '/menuManager' })
    },
    userManager () {
      this.$router.push({ path: '/userManager' })
    },
    changePassword () {
      this.modal1 = true
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'menuManager':this.menuManager()
          break
        case 'userManager': this.userManager()
          break
        case 'changePassword': this.changePassword()
          break
      }
    },
    ok () {
      this.$refs['formArg'].validate((valid) => {
        if (valid) {
          var changePasswordParam = {
            'old_password': this.formArg.old_password,
            'new_password': this.formArg.new_password
          }
          changePassword(changePasswordParam).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(res.data.message)
              this.modal1 = false
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    cancel () {
      this.$refs['formArg'].resetFields()
      this.modal1 = false
    }
  },
  watch: {
    modal1 (newVal) {
      if (newVal) {
        this.$refs['formArg'].resetFields()
      }
    }
  }
}
</script>
