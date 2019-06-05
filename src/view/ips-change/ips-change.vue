<template>
    <div>
        <Table :loading="loading" border ref="selection" :columns="columns4" :data="data1" @on-selection-change="onSelectionChange"></Table>
        <Button @click="handleSelectAll(true)" style="margin-top:9px;">全选</Button>
        <Button @click="handleSelectAll(false)" style="margin-left:9px;margin-top:9px;">取消全选</Button>
        <Button type="info" @click="confirm" style="margin-left:9px;margin-top:9px;" :disabled="disabled">{{buttonName}}</Button>
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
        title="完成"
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
  getDataByMenu,
  operateServer,
  getMenuList
} from '@/api/routers'
export default {
  data () {
    return {
      id: 1,
      menuList: [],
      disabled: true,
      buttonName: '',
      menuData: {},
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
        this.$Message.warning('请先选择操作项')
      }
    },
    ok () {
      this.$refs['formArg'].validate((valid) => {
        if (valid) {
          var operateServerParam = {
            'selected_servers': this.selectedIP,
            'username': this.formArg.username,
            'password': this.formArg.pwd,
            'operate_type': this.id
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
    },
    loadTable (_id) {
      this.loading = true
      getDataByMenu(_id).then(res => {
        if (res.data.code === 0) {
          this.loading = false
          this.disabled = false
          let tableHead = res.data.data.field_list
          this.data1 = res.data.data.data_list
          this.columns4 = [{
            type: 'selection',
            width: 60,
            align: 'center'
          }]
          for (var i in tableHead) {
            this.columns4.push({
              title: tableHead[i],
              key: tableHead[i],
              align: 'center'
            })
          }
        // for (var i in this.data1) {
        //   this.data1[i].status = this.data1[i].status === 1 ? '认证' : '非认证'
        // }
        } else {
          this.data1 = []
          this.disabled = true
          this.$Message.error(res.data.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  },
  created () {
    // 根据路由上的id去和menuList匹配找到当前的menu信息
    getMenuList().then(res => {
      let menus = res.data.data
      menus.forEach((menu, index) => {
        menus[index].meta = { 'title': menu.name }
      })
      this.menuList = menus
      let id = parseInt(this.$route.query.id)
      this.id = id
      for (var i in menus) {
        if (menus[i].id === id) this.menuData = menus[i]
      }
      this.buttonName = this.menuData.btn_name
      this.loadTable(id)
    }).catch(err => {
      console.log(err)
    })
  },
  beforeRouteUpdate (to, from, next) {
    let id = parseInt(to.query.id)
    this.id = id
    for (var i in this.menuList) {
      if (this.menuList[i].id === id) this.menuData = this.menuList[i]
    }
    this.buttonName = this.menuData.btn_name
    this.loadTable(id)
    next()
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  watch: {
    modal1 (newVal) {
      if (newVal) {
        this.$refs['formArg'].resetFields()
      }
    }
  }
  // menuList(newVal){
  //   let id = parseInt(this.$route.query.id)
  //   this.id=id
  //   for(var i in newVal){
  //     if(newVal[i].id===id) this.menuData=newVal[i]
  //   }
  //   this.buttonName=this.menuData.btn_name
  //   this.loadTable(id)
  // }
  // computed:{
  //   menuList () {
  //     return this.$store.state.menuList
  //   }
  // }
}
</script>
