<template>
    <div>
        <Table :loading="loading" border ref="selection" :columns="columns4" :data="userList" >
            <template slot-scope="{ row }" slot="username">
                <strong>{{ row.username }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button v-show="!row.is_superuser" type="primary" size="small" style="margin-right: 5px" @click="resetPassword(row.id,index)">重置密码</Button>
                <Button v-show="!row.is_superuser" type="error" size="small" @click="remove(row.id,index)">删除</Button>
            </template>
        </Table>
        <Button type="info" @click="add_open" style="margin-left:9px;margin-top:9px;">添加用户</Button>
        <Modal
        v-model="modal1"
        title="添加用户"
        >
            <Form ref="formArg" :model="formArg" :rules="ruleformArg" :label-width="120">
                <FormItem label="用户名：" prop="username">
                    <Input v-model="formArg.username" placeholder="请输入用户名：..."></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input v-model="formArg.password" placeholder="请输入密码：..."></Input>
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
import {
  addSysUser,
  geSysUserList,
  resetPassword,
  removeSysUser
} from '@/api/routers'
export default {
  data () {
    return {
      scriptList: [],
      userList: [],
      formArg: {
        username: '',
        password: ''
      },
      ruleformArg: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      modal1: false,
      loading: false,
      columns4: [
        {
          title: 'id',
          key: 'id',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username',
          align: 'center'
        },
        {
          title: '是否超级用户',
          key: 'is_superuser',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }

      ],
      data1: []
    }
  },
  methods: {
    add_open () {
      this.modal1 = true
    },
    ok () {
      this.$refs['formArg'].validate((valid) => {
        if (valid) {
          var addSysUserParam = Object.assign({}, this.formArg)
          addSysUser(addSysUserParam).then(res => {
            if (res.data.code === 0) this.$Message.success(res.data.message)
            this.modal1 = false
            this.loadTable()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    cancel () {
      this.$refs['formArg'].resetFields()
      this.modal1 = false
    },
    resetPassword (id, index) {
      this.$Modal.confirm({
        title: '确认重置密码？',
        content: `${this.userList[index].username}`,
        onOk: () => {
          resetPassword(id).then(res => {
            if (res.data.code === 0) {
              this.$Modal.info({
                title: '重置成功',
                content: `新密码：${res.data.data.new_password}`
              })
            }
          }).catch(err => {
            this.$Message.error(err.message)
          })
        },
        onCancel: () => {

        }
      })
    },
    loadTable () {
      this.loading = true
      geSysUserList().then(res => {
        if (res.data.code === 0) {
          this.loading = false
          this.userList = res.data.data
          // for(var i in this.userList){
          //   if(this.userList[i].is_superuser){
          //     this.userList[i].is_superuser='超级用户'
          //   }else{
          //     this.userList[i].is_superuser='普通用户'
          //   }
          // }
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error(err.message)
      })
    },

    remove (id, index) {
      this.$Modal.confirm({
        title: '确认删除？',
        content: `${this.userList[index].username}`,
        onOk: () => {
          removeSysUser(id).then(res => {
            if (res.data.code === 0) this.$Message.success('已删除')
            this.loadTable()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        },
        onCancel: () => {

        }
      })
    }
  },
  created () {
    this.loadTable()
  },
  watch: {
    modal1 (newVal) {
      if (newVal) {
        this.$refs['formArg'].resetFields()
        // getScripts().then(res => {
        //   this.scriptList = res.data.data
        // }).catch(err => {
        //   console.log(err)
        //   this.$Message.error(err.message)
        // })
      }
    }
  }
}
</script>
