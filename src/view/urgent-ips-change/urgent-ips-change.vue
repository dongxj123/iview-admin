<template>
    <div>
        <Table :loading="loading" border ref="selection" :columns="columns4" :data="data1" @on-selection-change="onSelectionChange"></Table>
        <Button @click="handleSelectAll(true)" style="margin-top:9px;">全选</Button>
        <Button @click="handleSelectAll(false)" style="margin-left:9px;margin-top:9px;">取消全选</Button>
        <Button type="info" @click="confirm" style="margin-left:9px;margin-top:9px;">切换</Button>
        <Modal
        v-model="modal1"
        title="请输入用户名密码"
        >
        <Form ref="formArg" :model="formArg" :rules="ruleformArg" :label-width="90">
            <FormItem label="用户名：" prop="username">
                <Input v-model="formArg.username" placeholder="请输入用户名：..."></Input>
            </FormItem>
            <FormItem label="密码：" prop="pwd">
                <Input v-model="formArg.pwd" placeholder="请输入密码：..."></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" @click="ok">确定</Button>
            <Button @click="cancel">取消</Button>
        </div>
    </Modal>
    <Modal
        v-model="modal2"
        title="切换完成"
        >
        <p>脚本名称：{{operateResult.script_name}}</p>
        <p>脚本执行开始时间：{{operateResult.start_date}}</p>
        <p>脚本执行结束时间：{{operateResult.exec_date}}</p>
        <p>标准错误:{{operateResult.stderr}}</p>
        <p>脚本执行返回码：{{operateResult.exec_code}}</p>
        <p>脚本执行参数：{{operateResult.options}}</p>
        <p>标准输出：{{operateResult.stdout}}</p>
        <p>操作用户：{{operateResult.operator}}</p>
        <p>参数用户：{{operateResult.username}}</p>
        <p>ip：{{operateResult.ip_param}}</p>
        <!-- <p>参数密码：******</p> -->
        <div slot="footer">
            <Button type="primary" @click="modal2 = false">确定</Button>
        </div>
    </Modal>
    </div>
</template>
<script>
import {
  getServerList,
  operateServer
} from '@/api/routers'
export default {
  data () {
    return {
      formArg: {
        username: '',
        pwd: ''
      },
      ruleformArg: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      operateResult: [],
      modal1: false,
      modal2: false,
      loading: false,
      columns4: [
        {
          title: 'ip',
          key: 'ip',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center'
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }
      ],
      data1: [],
      selectedIP: []
    }
  },
  methods: {
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    onSelectionChange (selection) {
      this.selectedIP = []
      for (var i in selection) {
        this.selectedIP.push(selection[i].ip)
      }
    },
    confirm () {
      if (this.selectedIP.length) {
        this.modal1 = true
      } else {
        this.$Message.warning('请先选择切换项')
      }
    },
    ok () {
      this.$refs['formArg'].validate((valid) => {
        if (valid) {
          var operateServerParam = {
            'selected_servers': this.selectedIP,
            'username': this.formArg.username,
            'password': this.formArg.pwd,
            'operate_type': 1
          }
          operateServer(operateServerParam).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(res.data.message)
            }
            this.operateResult = res.data.data
            this.modal2 = true
            this.modal1 = false
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
  created () {
    this.loading = true
    getServerList().then(res => {
      this.loading = false
      this.data1 = res.data.data
      for (var i in this.data1) {
        this.data1[i].status = this.data1[i].status === 1 ? '认证' : '非认证'
      }
    }).catch(err => {
      this.$Message.error(err.message)
    })
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
