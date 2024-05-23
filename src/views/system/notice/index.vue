<template>
  <div class="table-classic-wrapper">
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入关键字检索"
          class="input-long"
          clearable
          @keyup.enter.native="search"
        />
        <myButton
          v-if="pageOper.CX"
          :type="'search'"
          icon="el-icon-search"
          @click.native="search"
        >搜索</myButton>
      </div>

      <div class="right">
        <myButton
          v-if="pageOper.TJ"
          :type="'confirm'"
          icon="el-icon-plus"
          @click.native="edit(null)"
        >添加</myButton>
        <myButton
          v-if="pageOper.SC"
          :type="'confirm'"
          icon="el-icon-delete"
          @click.native="remove(null)"
        >删除</myButton>
      </div>
    </div>
    <myTable
      ref="fileTable"
      :show-index="true"
      :selection="true"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      custom-label="操作"
      custom-label-width="180px"
      :row-key="rowKey"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span
            v-if="pageOper.SC && scope.data.row.isAdminRole !== 1"
            title="删除"
            @click="remove(scope.data.row)"
          >
            删除
          </span>
        </myHandle>
      </template>
    </myTable>

    <edit
      v-if="editShow"
      :id="editId"
      :visible="editShow"
      :title="titleName"
      @close="editClose"
    />
  </div>
</template>

<script>
import { list, del } from '@/api/system/notice'
import edit from './edit'
export default {
  components: { edit },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      listQuery: {
        keyword: null,
        pageIndex: 1,
        pageSize: 10
      },
      checked: [
        { key: '公告标题', val: 'noticeTitle', width: '280px' },
        { key: '公告内容', val: 'noticeContent' },
        { key: '发布时间', val: 'addTime', width: '200px' }

      ],
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      loading: false,
      editShow: false,
      editId: null,
      titleName: null
    }
  },
  async created() {
    await this.getMainData()
  },
  methods: {
    rowKey(row) {
      return row.noticeId
    },
    multiple(e) {
      this.multipleSelection = e
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this
      this.loading = true
      list(that.listQuery)
        .then(res => {
          console.log(res)
          that.loading = false
          that.tableData = res.records
          that.listQuery.pageSize = res.size
          that.listQuery.pageIndex = res.current
          that.total = res.total
        })
        .catch(() => {
          that.loading = false
        })
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.noticeId) {
        this.editId = data.noticeId
        this.titleName = '编辑公告'
      } else {
        this.editId = null
        this.titleName = '新增公告'
      }
      this.editShow = true
    },
    /**
     * 关闭编辑页面
     */
    editClose(data) {
      this.editShow = false
      if (data.reload) {
        this.getMainData()
      }
    },
    // 删除
    remove(data) {
      const that = this
      let deleteData = []
      if (data == null) {
        deleteData = that.multipleSelection
      } else {
        deleteData.push(data)
      }
      var ids = []

      if (deleteData.length === 0) {
        that.$message({
          type: 'warning',
          message: '请选择需要删除的数据!'
        })
        return
      } else {
        deleteData.forEach(item => {
          ids.push(item.noticeId)
        })
      }
      this.$confirm('确认删除选中的' + deleteData.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true

          del(ids)
            .then(res => {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getMainData()
            })
            .finally(() => {
              that.loading = false
              that.multipleSelection = []
              that.$refs.fileTable.$refs.multipleTable.clearSelection()
            })
        })
        .catch(() => {
          // 取消删除
        })
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1
      this.tableData = []
      this.getMainData()
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.getMainData()
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex
      this.getMainData()
    },

    /**
     * 1. 获取导出表格的数据
     * 2. 调用子组件的方法实现导出
     */
    getExportTableData(total) {
      const that = this
      that.loading = true
      that.listQuery.pageIndex = 1
      that.listQuery.pageSize = total
      list(that.listQuery)
        .then(res => {
          that.$refs.fileTable.exportTable(res.records)
        })
        .finally(() => {
          that.loading = false
        })
    }
  }
}
</script>
