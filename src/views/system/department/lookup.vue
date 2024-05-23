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
      <el-col :span="6">
        <el-tree
          :data="depList"
          node-key="id"
          class="treeList"
          :highlight-current="isHight"
          :default-expanded-keys="defaultShowNodes"
          :default-expand-all="false"
          :expand-on-click-node="false"
          :default-checked-keys="['']"
          @node-click="nodeClick"
        >
          <span slot-scope="{ data }" class="app-tree-node">
            <span :title="data.name" class="node-text">{{
              data.name
            }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <!-- 操作栏 -->
        <div ref="appRowHeight" class="app-list-control app-row">
          <div class="flex">
            <el-select
              v-model.trim="listQuery.userName"
              filterable
              remote
              class="input-normal"
              placeholder="请输入用户昵称"
              :remote-method="remoteMethod"
              :loading="loading"
              clearable
              @keyup.native.enter="search"
              @change="changeSelect"
              @blur="blurSelect"
            >
              <el-option
                v-for="item in remoteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
import { list, likeUserNames } from '@/api/user'
import { treeList } from '@/api/department'

export default {
  name: 'Table',
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return '选择人员'
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
    },
    tags: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    userType: {
      type: Number,
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      // 数据列表加载动画
      loading: true,
      depList: [],
      entList: [],
      // 查询列表参数对象
      listQuery: {
        entId: null, // 企业id
        depId: null, // 部门Id
        userName: null, // 用户名称
        pageIndex: 1,
        pageSize: 10
      },
      remoteOptions: [],
      total: 0,
      timeStamp: 0,
      nowIndex: null,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      customLabel: '操作',
      checked: [
        { key: '企业名称', val: 'entName' },
        { key: '用户昵称', val: 'userName' },
        { key: '组织机构', val: 'depName' },
        { key: '联系电话', val: 'tel', align: 'center' }
      ],
      isHight: false,
      defaultShowNodes: []
    }
  },
  created() {
    this.listQuery.userType = this.userType
    this.getTreeList()

    this.getMainData()
    if (this.multiple) {
      this.customLabel = null
    }
  },
  mounted() {
    if (this.tags.length) {
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          this.$refs.fileTable.$refs.multipleTable.toggleRowSelection(item)
        })
      })
    }
  },
  methods: {
    getTreeList() {
      treeList().then((res) => {
        this.depList = res
        this.depList.unshift({
          id: '',
          name: '全部'
        })

        this.depList.forEach(item => {
          this.defaultShowNodes.push(item.id)
        })
      })
    },
    // 点击tree树的子节点
    nodeClick: function(data) {
      this.isHight = true
      if (data.isEnt) {
        this.listQuery.entId = data.id
        this.listQuery.depId = null
      } else {
        this.listQuery.depId = data.id
        this.listQuery.entId = null
      }
      this.search()
    },
    rowKey(row) {
      return row.userId
    },

    handleMultiple(e) {
      this.multipleSelection = e
    },

    getRemoteData(query) {
      likeUserNames({
        keyword: query
      }).then((res) => {
        this.remoteData = res
        this.remoteList = this.remoteData.map((item) => {
          return { value: `${item}`, label: `${item}` }
        })
        setTimeout(() => {
          this.loading = false
          this.remoteOptions = this.remoteList
        }, 200)
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
     * 远程搜索方法
     */
    remoteMethod(query) {
      if (query.trim()) {
        this.loading = true
        this.listQuery.userName = query
        this.getRemoteData(query)
      } else {
        this.remoteOptions = []
      }
    },
    changeSelect(val) {
      this.search()
      // if (!val) {
      //   this.remoteData = [];
      //   this.remoteList = [];
      //   this.remoteOptions = [];
      // }
    },
    blurSelect() {
      setTimeout(() => {
        this.remoteData = []
        this.remoteList = []
        this.remoteOptions = []
      }, 500)
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this
      this.loading = true
      list(that.listQuery)
        .then((res) => {
          that.loading = false
          that.timeStamp = new Date().getTime()

          that.entList.forEach((item) => {
            if (item.isSelect === '1') {
              that.entId = item.id
            }
          })
          that.tableData = res.page.records
          that.listQuery.pageSize = res.page.size
          that.listQuery.pageIndex = res.page.current
          that.total = res.page.total
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
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
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
    },
    // 清除所有搜索条件
    clearAll() {
      this.listQuery.entId = null
      this.listQuery.depId = null
      this.listQuery.userName = null
      this.search()
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

