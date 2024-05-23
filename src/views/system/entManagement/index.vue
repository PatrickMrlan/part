<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex" style="display: flex;">
        <el-input
          v-model="listQuery.keyword"
          placeholder="机构名称"
          clearable
          class="input-long"
          @keyup.native.enter="search"
        />
        <treeselect
          v-model="listQuery.industrySector"
          :multiple="false"
          :close-on-select="true"
          :options="industrySectorList"
          :default-expand-level="1"
          class="input-long"
          :disable-branch-nodes="true"
          :normalizer="treeSelectNormalizer"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
          placeholder="请选择行业领域"
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
      :table-data.sync="tableData"
      :d-c-authority="pageOper.DC"
      :total="total"
      :page-index="listQuery.pageIndex"
      custom-label="操作"
      custom-label-width="120px"
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
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>
    <edit
      v-if="editShow"
      :id="editId"
      :width="width"
      :title="titleName"
      @close="editColse"
    />
  </div>
</template>

<script>
import { list, remove, enumList } from '@/api/system/entManagement'
import edit from './edit'
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { Message } from 'element-ui'

export default {
  name: 'Table',
  components: { edit, treeselect },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      editShow: false,
      editId: null,

      listQuery: {
        keywords: null,
        pageIndex: 1,
        pageSize: 10
      },
      menuShow: false,
      // 新增/修改 标题
      titleName: null,
      // 筛选列
      checked: [
        { key: '机构名称', val: 'entName' },
        { key: '统一信用代码', val: 'entCode' },

        { key: '行业领域', val: 'industrySectorKey' },
        { key: '机构状态', val: 'entState', align: 'center', width: '120px' }
      ],
      // 展示列表
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      industrySectorList: [],
      nationalEconomyList: [],
      screenHeight: null,
      entId: null,
      width: null
    }
  },
  // watch: {
  //   // 监听值改变，重新加载数据
  //   depid(newV, oldV) {
  //     // do something
  //     this.getMainData();
  //   },
  // },
  created() {
    this.getEnumList()
    this.getMainData()
  },
  methods: {
    rowKey(row) {
      return row.id
    },

    getEnumList() {
      var that = this
      enumList()
        .then((res) => {
          that.industrySectorList = res.industrySectorList

          that.nationalEconomyList = res.nationalEconomyList
        })
        .catch(() => {
          that.loading = false
        })
    },
    /**
     * 表格多选回调事件
     */
    multiple(e) {
      // console.log(e);
      this.multipleSelection = e
    },
    /**
     * 搜索
     */
    search() {
      this.listQuery.pageIndex = 1
      this.tableData = []
      this.getMainData()
    },
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node)
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.code,
        label: node.title,
        children: node.children
      }
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this
      this.loading = true
      // that.listQuery.depId = that.depid
      list(that.listQuery)
        .then((res) => {
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
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records)
        })
        .finally(() => {
          that.loading = false
        })
    },
    /**
     * 关闭编辑页面
     */
    editColse(data) {
      this.editShow = false
      if (data.reload) {
        this.getMainData()
      }
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      // index 为 null 时添加
      console.log(data)
      if (data == null) {
        this.editId = null
        this.width = 500
        this.titleName = '新增机构'
      } else {
        this.editId = data.id
        this.width = 1000
        this.titleName = '修改机构'
      }
      this.editShow = true
    },

    /**
     * 删除/批量删除事件
     */
    remove(data) {
      console.log(data)
      const that = this
      let deleteData = []

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.entId)
        })
      } else {
        deleteData = [data.entId]
      }

      if (deleteData.length === 0) {
        Message({
          type: 'warning',
          message: '请选择需要删除的数据!'
        })
        return
      }
      this.$confirm('确认删除选中的' + deleteData.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          remove(deleteData)
            .then((res) => {
              that.loading = false
              Message({
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
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .vue-treeselect__control{
    height: 32px;
}
/deep/ .vue-treeselect__placeholder{
    line-height: 32px;
}
</style>
