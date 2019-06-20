<template>
    <div>
        <Table :loading="loading" :columns="columns1" :data="tableData"></Table>
        <Page class="page" :total="totalNum" :current="current" :page-size="pageSize" @on-page-size-change="onPageSizeChange" @on-change="onChange" show-total show-sizer show-elevator />
    </div>
</template>

<script>
import {
  getExecLog
} from '@/api/routers'
import expandRow from './table-expand.vue'
export default {
  components: { expandRow },
  data () {
    return {
      loading: false,
      pageSize: 10,
      current: 1,
      columns1: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '操作人',
          key: 'operator',
          width: 90
        },
        {
          title: '开始时间',
          key: 'start_date',
          width: 190
        },
        {
          title: '结束时间',
          key: 'exec_date',
          width: 190
        },
        {
          title: '菜单名称',
          key: 'menu_name',
          width: 100
        },
        {
          title: '按钮名称',
          key: 'btn_name',
          width: 100
        },
        // {
        //   title: '名称',
        //   key: 'script_name',
        //   width:80
        // },

        // {
        //   title: '输入用户',
        //   key: 'username'
        // },
        {
          title: '返回',
          key: 'exec_code',
          width: 60
        },
        // {
        //   title: '执行参数',
        //   key: 'options'
        // },
        // {
        //   title: 'ip',
        //   key: 'ip_param',
        // }
        {
          title: '标准输出',
          key: 'stdout'
        }
      ],
      totalNum: 0,
      tableData: []
    }
  },
  methods: {
    onChange (index) {
      this.current = index
      this.reloadTableData(index, this.pageSize)
    },
    onPageSizeChange (index) {
      this.pageSize = index
      this.reloadTableData(this.current, index)
    },
    reloadTableData (page, pageSize) {
      this.loading = true
      getExecLog(page, pageSize).then(res => {
        this.tableData = res.data.data.list
        this.totalNum = res.data.data.total_count
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message)
      })
    }
  },
  created () {
    this.reloadTableData(1, this.pageSize)
  }
}
</script>

<style lang="less" scoped>
.page{
    margin-bottom: 40px;
    margin-top: 10px;
}
</style>
