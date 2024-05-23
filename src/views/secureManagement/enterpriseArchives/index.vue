<template>
  <div class="table-classic-wrapper">
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model.trim="listQuery.keyword"
          placeholder="请输入企业名称"
          clearable
          class="input-short"
          @keyup.native.enter="search"
        />

        <treeselect
          v-model="listQuery.industrySector"
          class="input-long"
          :multiple="false"
          :close-on-select="true"
          :options="industrySectorList"
          :default-expand-level="1"
          :disable-branch-nodes="true"
          :normalizer="treeSelectNormalizer"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
          placeholder="请选择行业领域"
        />

        <treeselect
          v-model="listQuery.nationalEconomy"
          class="input-long"
          :multiple="false"
          :close-on-select="true"
          :options="nationalEconomyList"
          :default-expand-level="1"
          :disable-branch-nodes="true"
          :normalizer="treeSelectNormalizer"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
          placeholder="请选择国民经济分类"
        />

        <myButton
          v-if="pageOper.CX"
          type="search"
          icon="el-icon-search"
          @click.native="search"
        >搜索</myButton>
      </div>
      <div class="right">
        <myButton
          v-if="pageOper.XG"
          icon="el-icon-edit"
          @click.native="edit(null)"
        >编辑</myButton>
        <!-- <myButton icon="el-icon-delete" type="remove" v-if="pageOper.SC"
          >批量删除</myButton
        > -->
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
      custom-label-width="100px"
      :row-key="rowKey"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span
            v-if="pageOper.XG"
            title="编辑"
            @click="edit(scope.data.row)"
          >编辑</span>
          <!-- <span title="删除" @click="remove(scope.data.row)">删除</span> -->
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
import edit from './edit.vue'
import { list, remove, enumList } from '@/api/system/enterprise'
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { edit, treeselect },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      loading: false,
      listQuery: {
        keyword: null,
        industrySector: null,
        nationalEconomy: null,
        parkId: null,
        startDate: null,
        endDate: null,
        pageIndex: 1,
        pageSize: 10
      },

      // 筛选列
      checked: [
        { key: '企业名称', val: 'entName' },
        {
          key: '行业领域',
          val: 'industrySectorKey'
        },
        {
          key: '国民经济分类',
          val: 'nationalEconomyKey'
        },
        { key: '注册地址', val: 'registeredAddress' },
        {
          key: '添加时间',
          val: 'addTime',
          align: 'center',
          width: '150px'
        }
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],

      titleName: null,
      editShow: false,
      editId: null,

      industrySectorList: [],
      nationalEconomyList: []
    }
  },
  created() {
   

    this.getEnumList()
    this.getMainData()
  },
  methods: {
    rowKey(row) {
      return row.entId
    },

    getEnumList() {
      enumList().then((res) => {
        this.industrySectorList = res.industrySectorList
        this.nationalEconomyList = res.nationalEconomyList
      })
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this
      that.loading = true
      list(that.listQuery)
        .then((res) => {
          that.tableData = res.records
          that.listQuery.pageSize = res.size
          that.listQuery.pageIndex = res.current
          that.total = res.total
        })
        .finally(() => {
          that.loading = false
        })
    },

    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node);
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
     * 搜索
     */
    search() {
      this.listQuery.pageIndex = 1
      this.tableData = []
      this.getMainData()
    },

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e
    },

    /**
     * 添加/编辑
     */
    edit(data) {
      if (data) {
        this.titleName = '编辑企业'
        this.editId = data.entId
      } else {
        this.titleName = '编辑企业'
        // this.editId = null;
        this.editId = 1
      }
      this.editShow = true
    },

    /**
     * 关闭侧边框
     */
    editClose(data) {
      this.editShow = false
      if (data.reload) {
        this.getMainData()
      }
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
      list({ pageIndex: 1, pageSize: total })
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records)
        })
        .finally(() => {
          that.loading = false
        })
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
        that.$message({
          type: 'warning',
          message: '请选择需要删除的数据!'
        })
        return
      }
      that
        .$confirm('确认删除选中的' + deleteData.length + '条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.loading = true

          remove(deleteData)
            .then((res) => {
              that.loading = false
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
