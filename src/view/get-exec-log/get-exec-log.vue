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
export default {
  data () {
    return {
      loading: false,
      pageSize: 10,
      current: 1,
      columns1: [
        {
          title: '脚本执行结束时间',
          key: 'exec_date'
        },
        {
          title: '脚本名称',
          key: 'script_name'
        },
        {
          title: '脚本执行开始时间',
          key: 'start_date'
        },
        {
          title: '标准错误',
          key: 'stderr'
        },
        {
          title: '脚本执行返回码',
          key: 'exec_code'
        },
        {
          title: '脚本执行参数',
          key: 'options'
        },
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
