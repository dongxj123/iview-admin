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
         :mask-closable="false"
        >
            <Form ref="formArg" :model="formArg" :rules="ruleformArg" :label-width="120">
                <FormItem label="菜单名称：" prop="name">
                    <Input v-model="formArg.name" placeholder="请输入菜单名称：..."></Input>
                </FormItem>
                <FormItem label="排序值：" prop="order_num">
                    <Input type="number" v-model="formArg.order_num" placeholder="请输入排序值：..."></Input>
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
        order_num: '',
        type: 3,
        url: 'rongzai/rongzai-detail'
      },
      ruleformArg: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        order_num: [
          { required: true, message: '排序值不能为空' }
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
          if (menu.type === 3) this.menuList.push(menus[index])
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
