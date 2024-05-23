<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入姓名、手机号码进行检索"
          class="input-long"
          clearable
          @keyup.enter.native="search"
        />
        <el-select
          v-model="listQuery.postLevel"
          placeholder="责任层级"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in postLevelList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.completionStatus"
          placeholder="完成情况"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in completionStatusList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

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
          icon="el-icon-plus"
          @click.native="edit(null)"
        >添加</myButton>
        <myButton
          v-if="pageOper.SC"
          type="remove"
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
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      :table-data="tableData"
      custom-label="操作"
      custom-label-width="160px"
      custom1-label="完成情况"
      custom1-label-width="100px"
      :row-key="rowKey"
      @change="multiple"
      :on-resize-height="118"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom1" slot-scope="scope">
        <span
          :class="scope.data.row.completionStatus=='未完成'?'completionStatus':'completionStatus1'"
        >{{ scope.data.row.completionStatus }}</span>
      </template>

      <template slot="custom" slot-scope="scope">
        <myHandle>
          <!-- <span title="详情">
            详情
          </span> -->
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
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
import { list, enumList, del } from '@/api/security/inventory'
import edit from './edit'
export default {
  components: { edit },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      loading: false,
      checked: [
        { key: '岗位名称', val: 'postName', align: 'center', width: '200px' },
        { key: '责任层级', val: 'postLevel', align: 'center' },
        { key: '岗位人数', val: 'userCount', align: 'center' },
        { key: '责任清单', val: 'duty', align: 'center' },
        { key: '履职清单', val: 'performance', align: 'center' }
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        postLevel: null,
        completionStatus: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10
      },
      editShow: false,
      editId: null,
      titleName: null,
      completionStatusList: [], // 枚举
      postLevelList: [],
      editShow: false,
      editId: null,
      titleName: null
    }
  },
  async created() {
    await this.getlist()
    await this.getenumList()
  },
  methods: {
    rowKey(row) {
      return row.postId
    },
    multiple(e) {
      // console.log(e);
      this.multipleSelection = e
    },
    getlist() {
      const that = this
      this.loading = true
      list(this.listQuery)
        .then(res => {
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
    getenumList() {
      const that = this
      enumList().then(res => {
        that.completionStatusList = res.completionStatusList
        that.postLevelList = res.postLevelList
      })
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.postId) {
        this.editId = data.postId
        this.titleName = '编辑岗位'
      } else {
        this.editId = null
        this.titleName = '新增岗位'
      }
      this.editShow = true
    },
    /**
     * 关闭编辑页面
     */
    editClose(data) {
      this.editShow = false
      if (data.reload) {
        this.getlist()
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
          ids.push(item.postId)
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
              that.getlist()
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
      this.getlist()
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.getlist()
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex
      this.getlist()
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
<style lang="scss" scoped>
.completionStatus {
  color: #d9001b;
}
.completionStatus1 {
  color: #02830f;
}
</style>
