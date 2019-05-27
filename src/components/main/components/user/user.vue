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
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { getUserName } from '@/libs/util'
export default {
  data () {
    return {
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
      }
    }
  }
}
</script>
