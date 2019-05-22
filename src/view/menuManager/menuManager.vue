<template>
    <div>
        <Table :loading="loading" border ref="selection" :columns="columns4" :data="menuList" >
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
        </template>
        </Table>
        <Button type="info" @click="add_open" style="margin-left:9px;margin-top:9px;">新增</Button>
        <Modal
        v-model="modal1"
        title="菜单操作"
        >
            <Form ref="formArg" :model="formArg" :rules="ruleformArg" :label-width="120">
                <FormItem label="菜单名称：" prop="name">
                    <Input v-model="formArg.name" placeholder="请输入菜单名称：..."></Input>
                </FormItem>
                <FormItem label="数据库的表名：" prop="table_name">
                    <Input v-model="formArg.table_name" placeholder="请输入数据库的表名：..."></Input>
                </FormItem>
                <FormItem label="按钮名称：" prop="btn_name">
                    <Input v-model="formArg.btn_name" placeholder="请输入按钮名称：..."></Input>
                </FormItem>
                <FormItem label="选择按钮脚本：" prop="btn_script">
                    <Select v-model="formArg.btn_script" placeholder="请选择按钮脚本">
                        <Option v-for="(val,i) in scriptList" :value="val" :key="i">{{ val }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序值：" prop="order_num">
                    <Input type="number" v-model="formArg.order_num" placeholder="请输入排序值：..."></Input>
                </FormItem>
                <FormItem label="静态参数：" prop="static_param">
                    <Input v-model="formArg.static_param" placeholder="请输入静态参数（可为空）：..."></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="ok">{{sub_name}}</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {
  getMenuList,
  addMenu,
  getScripts,
  editMenu,
  removeMenu
} from '@/api/routers'
export default {
  data () {
    return {
      operateType: '',
      scriptList: [],
      menuList: [],
      sub_name: '',
      formArg: {
        name: '',
        table_name: '',
        btn_name: '',
        order_num: '',
        btn_script: '',
        static_param: '',
        type: 2,
        url: 'rongzai/ips-change'
      },
      ruleformArg: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        table_name: [
          { required: true, message: '数据库表名不能为空', trigger: 'blur' }
        ],
        btn_name: [
          { required: true, message: '按钮名称不能为空', trigger: 'blur' }
        ],
        order_num: [
          { required: true, message: '排序值不能为空' }
        ],
        btn_script: [
          { required: true, message: '请选择按钮脚本', trigger: 'change' }
        ]
      },
      operateResult: [],
      modal1: false,
      loading: false,
      columns4: [
        {
          title: 'id',
          key: 'id',
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '表',
          key: 'table_name',
          align: 'center'
        },
        {
          title: '按钮名称',
          key: 'btn_name',
          align: 'center'
        },
        {
          title: '执行脚本',
          key: 'btn_script',
          align: 'center'
        },
        {
          title: '排序值',
          key: 'order_num',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }

      ],
      data1: []
    }
  },
  methods: {
    add_open () {
      this.sub_name = '添加'
      this.modal1 = true
      this.operateType = 'add'
    },
    edit (index) {
      this.sub_name = '更新'
      this.modal1 = true
      this.operateType = 'edit'
      this.formArg = Object.assign({}, this.menuList[index])
    },
    ok () {
      this.$refs['formArg'].validate((valid) => {
        if (valid) {
          if (this.operateType === 'add') {
            var addMenuParam = Object.assign({}, this.formArg)
            addMenuParam.order_num = parseInt(addMenuParam.order_num)
            addMenu(addMenuParam).then(res => {
              if (res.data.code === 0) this.$Message.success(res.data.message)
              this.modal1 = false
              this.loadTable()
              this.$store.dispatch('updateSideMenuList')
            }).catch(err => {
              this.$Message.error(err.message)
            })
          } else {
            var editMenuParam = Object.assign({}, this.formArg)
            editMenuParam.order_num = parseInt(editMenuParam.order_num)
            delete editMenuParam.meta
            console.log(editMenuParam)
            editMenu(editMenuParam).then(res => {
              if (res.data.code === 0) this.$Message.success(res.data.message)
              this.modal1 = false
              this.loadTable()
              this.$store.dispatch('updateSideMenuList')
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        }
      })
    },
    cancel () {
      this.$refs['formArg'].resetFields()
      this.modal1 = false
    },
    loadTable () {
      this.loading = true
      this.menuList = []
      getMenuList().then(res => {
        this.loading = false
        let menus = res.data.data
        menus.forEach((menu, index) => {
          menus[index].meta = { 'title': menu.name }
          if (menu.type === 2) this.menuList.push(menus[index])
        })
        // this.menuList = menus
      }).catch(err => {
        console.log(err)
        this.$Message.error(err.message)
      })
    },

    remove (index) {
      this.$Modal.confirm({
        title: '确认删除？',
        content: `${this.menuList[index].name}`,
        onOk: () => {
          let id = this.menuList[index].id
          removeMenu(id).then(res => {
            if (res.data.code === 0) this.$Message.success('已删除')
            this.loadTable()
            this.$store.dispatch('updateSideMenuList')
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
        getScripts().then(res => {
          this.scriptList = res.data.data
        }).catch(err => {
          console.log(err)
          this.$Message.error(err.message)
        })
      }
    }
  }
}
</script>
