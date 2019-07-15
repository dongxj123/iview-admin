<template>
    <div>
        <Table size="small" :loading="loading" border ref="selection" :columns="columns4" :data="data1" @on-selection-change="onSelectionChange"></Table>
        <Button @click="handleSelectAll(true)" style="margin-top:9px;">全选</Button>
        <Button @click="handleSelectAll(false)" style="margin-left:9px;margin-top:9px;">取消全选</Button>
        <Button type="info" @click="confirm_original" style="width:150px;margin-left:9px;margin-top:9px;" :disabled="disabled">{{buttonName}}</Button>
        <Dropdown @on-click="editButton($event,item)"  class="button-distance" trigger="contextMenu" v-for="(item,index) in buttonList" :key="index">
            <Button style="width:150px;margin-left:9px;margin-top:9px;" :type="item.have_sms_auth==0?'success':'error'" @click="confirm(item)">
                {{item.name}}
            </Button>
            <DropdownMenu slot="list" v-show="username.is_superuser">
                <DropdownItem name="edit">编辑</DropdownItem>
                <DropdownItem name="deleteBtn" style="color: #ed4014">删除</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Button class="add-btn" style="margin-left:9px;margin-top:9px;" v-show="username.is_superuser" type="primary" @click="openAdd('add')">添加按钮</Button>

        <Modal
        v-model="modal3"
        title="容灾按钮操作"
        >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
            <FormItem label="按钮名称：" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入按钮名称：..."></Input>
            </FormItem>
            <FormItem label="选择脚本：" prop="script">
                <Select v-model="formValidate.script" placeholder="请选择脚本">
                    <Option v-for="(val,i) in scriptList" :value="val" :key="i">{{ val }}</Option>
                </Select>
            </FormItem>
            <FormItem label="验证选项：">
                <Checkbox v-model="formValidate.have_sms_auth">短信验证</Checkbox>
                <Checkbox v-model="formValidate.have_password_auth">用户密码验证</Checkbox>
            </FormItem>
            <FormItem label="脚本参数：" prop="static_param">
                <Input v-model="formValidate.static_param" type="textarea" placeholder="请输入脚本参数（非必填）" />
            </FormItem>
            <FormItem label="按钮排序：" prop="order_num">
                <Input  type="number" v-model="formValidate.order_num" placeholder="请输入按钮排序" />
            </FormItem>
            <FormItem>
                <Button :disabled="disabled_add" type="primary" @click="handleSubmit()">{{submitName}}</Button>
                <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
        <div slot="footer" style="display:none;"></div>
    </Modal>
    <Modal
        v-model="modal1"
        title="确认执行脚本？"
        >
        <Form ref="formArg" :model="formArg" :rules="ruleformArg" :label-width="90">
            <FormItem label="按钮名称：" style="margin-bottom:10px;">
                <span>{{curentBtn.name}}</span>
            </FormItem>
            <FormItem label="用户名：" prop="username" v-if="curentBtn.have_password_auth==1">
                <Input v-model="formArg.username" placeholder="请输入用户名：..."></Input>
            </FormItem>
            <FormItem label="密码：" prop="pwd" v-if="curentBtn.have_password_auth==1">
                <Input v-model="formArg.pwd" :type="inputType" @on-focus="typeToPassWord" placeholder="请输入密码：..."></Input>
            </FormItem>
            <FormItem label="验证码：" prop="verifyCode" v-if="curentBtn.have_sms_auth==1">
                <Input v-model="formArg.verifyCode" placeholder="请输入验证码：..."></Input>
                <Button type="primary" style="margin-top:10px;" @click="sendMsg" :disabled="disabled_sm">{{name_sm}}</Button>
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
  getMenuList,
  getButtonsByMenu,
  editButton,
  deleteButton,
  getScripts,
  addButton
} from '@/api/routers'
import { getUserName } from '@/libs/util'
export default {
  data () {
    return {
      submitName: '',
      disabled_add: false,
      scriptList: [],
      username: JSON.parse(getUserName()),
      ruleValidate: {
        name: [
          { required: true, message: '按钮名称不能为空', trigger: 'blur' }
        ],
        script: [
          { required: true, message: '请选择脚本', trigger: 'change' }
        ],
        order_num: [
          { required: true, message: '按钮排序不能为空' }
        ]
      },
      formValidate: {
        name: '',
        script: '',
        static_param: '',
        have_password_auth: false,
        have_sms_auth: false,
        order_num: ''
      },
      modal3: false,
      curentBtn: {},
      buttonList: [],
      inputType: 'text',
      // id: 1,
      name_sm: '发送验证码',
      disabled_sm: false,
      menuList: [],
      disabled: true,
      buttonName: '',
      menuData: {},
      formArg: {
        username: '',
        pwd: '',
        verifyCode: ''
      },
      ruleformArg: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
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
    openAdd (fun) {
      this.operateType = 'add'
      // 执行handleSubmit时判断是添加还是编辑
      if (fun === 'add') {
        this.formValidate.have_password_auth = false
        this.formValidate.have_sms_auth = false
        this.submitName = '添加'
        this.modal3 = true
      }
    },
    handleReset () {
      this.$refs['formValidate'].resetFields()
      this.disabled_add = false
    },
    handleSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          if (this.operateType === 'add') {
            this.disabled_add = true
            var addButtonParam = Object.assign({}, this.formValidate)
            addButtonParam.have_password_auth = this.formValidate.have_password_auth ? 1 : 0
            addButtonParam.have_sms_auth = this.formValidate.have_sms_auth ? 1 : 0
            addButtonParam.menu_id = this.$route.query.id
            addButton(addButtonParam).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(res.data.message)
              }
              this.disabled_add = false
              this.reload(this.id)
              this.modal3 = false
            }).catch(err => {
              console.log(err)
              this.$Message.error(err.message)
            })
          } else {
            this.disabled_add = true
            var editButtonParam = Object.assign({}, this.formValidate)
            editButtonParam.have_password_auth = editButtonParam.have_password_auth ? 1 : 0
            editButtonParam.have_sms_auth = editButtonParam.have_sms_auth ? 1 : 0
            editButtonParam.id = this.editID
            editButton(editButtonParam).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功')
              }
              this.disabled_add = false
              this.reload(this.id)
              this.modal3 = false
            }).catch(err => {
              console.log(err)
              this.$Message.error(err.message)
            })
          }
        } else {
          // this.$Message.error('Fail!');
        }
      })
    },
    editButton (event, item) {
      if (event === 'edit') {
        this.operateType = 'edit'
        this.submitName = '确认编辑'
        this.formValidate = {
          name: item.name,
          script: item.script,
          static_param: item.static_param,
          have_password_auth: !!item.have_password_auth,
          have_sms_auth: !!item.have_sms_auth,
          order_num: item.order_num
        }
        // this.have_password_auth=item.have_password_auth?true:false;
        // this.have_sms_auth=item.have_sms_auth?true:false;
        this.editID = item.id
        this.$Message.info('您正在编辑...')
        this.modal3 = true
      } else if (event === 'deleteBtn') {
        this.$Modal.confirm({
          title: '确认删除？',
          content: `${item.name}`,
          onOk: () => {
            let id = item.id
            deleteButton(id).then(res => {
              if (res.data.code === 0) this.$Message.success('已删除')
              this.reload(this.id)
            }).catch(err => {
              this.$Message.error(err.message)
            })
          },
          onCancel: () => {

          }
        })
      }
    },
    reload (_id) {
      let buttons = []
      getButtonsByMenu(_id).then(res => {
        buttons = res.data.data
        this.buttonList = buttons
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    typeToPassWord () {
      this.inputType = 'password'
    },
    sendMsg () {
      // this.$router.push({
      //   name:'rongzai/rongzai-detail',
      //   query:{save:1}
      // })
      // this.disabled_sm = true
      // this.name_sm = '再次发送（60）'
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    onSelectionChange (selection) {
      this.selectedIP = []
      for (var i in selection) {
        this.selectedIP.push(selection[i].ip)
      }
    },
    confirm (btnMsg) {
      if (this.selectedIP.length) {
        this.curentBtn = btnMsg
        this.modal1 = true
      } else {
        this.$Message.warning('请先选择操作项')
      }
    },
    confirm_original () {
      if (this.selectedIP.length) {
        this.curentBtn = {
          'have_password_auth': this.menuData.have_password_auth,
          'have_sms_auth': this.menuData.have_sms_auth,
          'id': 0,
          'menu_id': this.menuData.id,
          'name': this.menuData.name,
          'order_num': this.menuData.order_num,
          'script': this.menuData.script,
          'static_param': this.menuData.static_param
        }
        // button_id > 0 表示执行额外按钮 ，button_id = 0 表示执行原始按钮
        this.modal1 = true
      } else {
        this.$Message.warning('请先选择操作项')
      }
    },
    operateServer () {
      var operateServerParam = {
        'selected_servers': this.selectedIP,
        'username': this.formArg.username,
        'password': this.formArg.pwd,
        'operate_type': this.id,
        'sms_key': '1234',
        'sms_code': '5678',
        'button_id': this.curentBtn.id
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
    },
    ok () {
      if (!this.curentBtn.have_password_auth && !this.curentBtn.have_sms_auth) {
        this.operateServer()
      } else {
        this.$refs['formArg'].validate((valid) => {
          if (valid) {
            this.operateServer()
          }
        })
      }
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
      for (var i in menus) {
        if (menus[i].id === id) this.menuData = menus[i]
      }
      this.buttonName = this.menuData.btn_name
      this.loadTable(id)
    }).catch(err => {
      console.log(err)
    })
    this.reload(this.id)
  },
  beforeRouteUpdate (to, from, next) {
    let id = parseInt(to.query.id)
    for (var i in this.menuList) {
      if (this.menuList[i].id === id) this.menuData = this.menuList[i]
    }
    this.buttonName = this.menuData.btn_name
    this.loadTable(id)
    this.reload(id)
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
    },
    modal3 (newVal) {
      if (newVal) {
        // 清空表单
        this.$refs['formValidate'].resetFields()
        let scripts = []
        getScripts().then(res => {
          scripts = res.data.data
          this.scriptList = scripts
        }).catch(err => {
          console.log(err)
          this.$Message.error(err.message)
        })
      }
    }
  },
  computed: {
    id () {
      return parseInt(this.$route.query.id)
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
<style scope>
.ivu-table-small td {
    height: 30px;
}
/* .button-distance{
    margin: 10px;
}
.add-btn{
    position: absolute;
    margin: 10px;
} */
</style>
