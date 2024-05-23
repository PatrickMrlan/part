<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.roleName"
          placeholder="角色名称"
          clearable
          class="input-short"
          @keyup.native.enter="search"
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
      export-file-name="角色管理"
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
          <span title="权限配置" @click="permissionDeploy(scope.data.row)">
            权限配置
          </span>
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>
    <edit v-if="editShow" :id="editId" :title="titleName" @close="editColse" />
    <Permission
      v-if="permissionShow"
      :role-id="roleId"
      @close="permissionClose"
    />
  </div>
</template>

<script>
import { list, remove } from '@/api/role'
import edit from './edit'
import Permission from '../userGroup/editAppConfig'
import { Message } from 'element-ui'

// import { Message } from 'element-ui'
// import excel from '../../../utils/excel'
// import Pagination from '../../../components/Pagination'
// import Upload from '../../../components/Upload'

export default {
  name: 'Table',
  components: { edit, Permission },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      // 数据列表加载动画
      loading: true,
      editShow: false,
      editId: null,
      permissionShow: false,
      roleId: null,
      // 新增/修改 标题
      titleName: null,
      // 筛选列
      checked: [
        { key: '角色名称', val: 'roleName' },
        { key: '角色编码', val: 'roleCode' },
        { key: '角色说明', val: 'remake' },
        { key: '添加时间', val: 'addTime', align: 'center' }
      ],
      // 查询列表参数对象
      listQuery: {
        roleName: null,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: []
    }
  },
  mounted() {
    this.getMainData()
  },
  methods: {
    rowKey(row) {
      return row.roleId
    },
    multiple(e) {
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
      // that.listQuery.depId = that.depid
      console.log(that.listQuery)
      list(that.listQuery)
        .then((res) => {
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
      const that = this;
      that.loading = true;
      that.listQuery.pageIndex = 1;
      that.listQuery.pageSize = total;
      list(that.listQuery)
        .then((res) => {
          
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
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
      if (data == null) {
        this.editId = null
        this.titleName = '新增角色信息'
      } else {
        this.editId = data.roleId
        this.titleName = '修改角色信息'
      }
      this.editShow = true
    },
    /**
     * 授权
     */
    permissionDeploy(data) {
      this.permissionShow = true
      this.roleId = data.roleId
    },
    permissionClose() {
      this.permissionShow = false
    },
    /**
     * 删除/批量删除事件
     */
    remove(data) {
      const that = this
      let deleteData = []
      if (data == null) {
        deleteData = that.multipleSelection
      } else {
        deleteData.push(data)
      }
      console.log(deleteData)
      var ids = []

      if (deleteData.length === 0) {
        Message({
          type: 'warning',
          message: '请选择需要删除的数据!'
        })
        return
      } else {
        deleteData.forEach((item) => {
          ids.push(item.roleId)
        })
      }
      this.$confirm('确认删除选中的' + deleteData.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true

          remove(ids)
            .then((res) => {
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
</style>
