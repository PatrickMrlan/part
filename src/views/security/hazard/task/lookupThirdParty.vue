<template>
  <myDialog
    :title="title"
    width="1000px"
    class="dialog-form"
    :visible="show"
    :cancel="cancel"
    :top="'10vh'"
  >
    <div class="table-classic-wrapper">

      <el-col>
        <!-- 操作栏 -->
        <div ref="appRowHeight" class="app-list-control app-row">
          <div class="flex">
            <el-input
              v-model="listQuery.keyword"
              placeholder="关键词查询"
              class="input-normal"
              clearable
              @keyup.enter.native="search"
            />
            <!-- <el-input
                v-model="listQuery.userName"
                class="input-normal"
                clearable
                placeholder="用户昵称"
                @keyup.native.enter="search"
              /> -->
            <myButton
              icon="el-icon-search"
              @click.native="search"
            >搜索</myButton>
          </div>
          <div v-if="multiple" class="right">
            <myButton
              icon="el-icon-refresh"
              @click.native="reset"
            >重置已选中（{{ multipleSelection.length }}）个</myButton>
            <myButton
              icon="el-icon-check"
              @click.native="check(null)"
            >选择</myButton>
          </div>
        </div>
        <myTable
          ref="fileTable"
          :show-index="multiple"
          :selection="multiple"
          :on-resize-height="false"
          :checked="checked"
          :loading.sync="loading"
          :table-data="tableData"
          :total.sync="total"
          :show-tools-right="false"
          :page-index="listQuery.pageIndex"
          :custom-label="customLabel"
          custom-label-width="60px"
          :row-key="rowKey"
          @change="handleMultiple"
          @pageSizeChange="pagerSizeChange"
          @pageCurrentChange="pagerCurrentChange"
        >
          <template slot="custom" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              circle
              icon="el-icon-check"
              @click="check(scope.data.$index)"
            />
          </template>
        </myTable>
      </el-col>
    </div>
  </myDialog>
</template>

<script>
import { list } from '@/api/thirdparty/information'

export default {
  name: 'Table',
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return '选择第三方'
      }
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    },
    show: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    }

  },
  data() {
    return {
      // 数据列表加载动画
      loading: true,

      // 查询列表参数对象
      listQuery: {
        keyword: null,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      timeStamp: 0,
      nowIndex: null,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      customLabel: '操作',
      checked: [
        { key: '第三方名称', val: 'thirdPartyName', width: '120px', align: 'center' },
        { key: '联系人', val: 'contact', align: 'center' },
        { key: '联系电话', val: 'contactTel', align: 'center' },
        { key: '第三方地址', val: 'address', align: 'center' },
        { key: '统一社会信用代码', val: 'thirdPartyCode', width: '150px', align: 'center' },
        { key: '成立日期', val: 'establishDate', align: 'center', width: '120px' }
      ],
      isHight: false,
      defaultShowNodes: []
    }
  },
  created() {
    this.getMainData()
    if (this.multiple) {
      this.customLabel = null
    }
  },
  mounted() {

  },
  methods: {

    rowKey(row) {
      return row.userId
    },

    handleMultiple(e) {
      this.multipleSelection = e
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
    cancel(done) {
      this.$emit('close', this.multipleSelection, false)
      this.multipleSelection = []
      this.listQuery.pageIndex = 1
      this.getMainData()
    },

    check(index) {
      if (index != null && index >= 0) {
        this.multipleSelection = []
        this.multipleSelection.push(this.tableData[index])
      }
      this.$emit('close', this.multipleSelection, true)
    },
    // 重置
    reset() {
      // 清空所有选中的行
      this.$refs.fileTable.$refs.multipleTable.clearSelection()
      this.multipleSelection = []
      this.listQuery.pageIndex = 1
      this.getMainData()
    }

  }
}
</script>

        <style lang="less" scoped>
  .flex {
    display: flex;
    align-items: center;
  }

  .table-classic-wrapper{
    overflow: hidden;
  }
  .treeList{
    min-height: calc(100vh - 340px);
    box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);
    margin-right: 10px;
    padding: 10px 0;
  }
  </style>

