
<template>
  <div id="table-classic-wrapper" class="table-classic-wrapper">
    <el-col :span="14" style="margin-right: 20px">
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="taskListQuery.keyword"
            placeholder="计划名称"
            clearable
            class="input-short"
            @keyup.native.enter="search"
          />
          <el-select
            v-model="taskListQuery.isMe"
            class="input-small"
            placeholder="查看全部"
          >
            <el-option
              v-for="item in meList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="taskListQuery.inspectType"
            class="input-small"
            clearable
            placeholder="检查类型"
          >
            <el-option
              v-for="item in inspectTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="taskListQuery.taskState"
            class="input-small"
            clearable
            placeholder="任务状态"
          >
            <el-option
              v-for="item in taskStateList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="taskListQuery.isEntrust"
            class="input-small"
            clearable
            placeholder="是否为委托任务"
          >
            <el-option
              v-for="item in yesOrNoList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
          <!-- <el-button icon="el-icon-circle-close" circle @click="clearAll" /> -->
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
            @click.native="editTask(null)"
          >添加</myButton>
          <!-- <myButton
            v-if="pageOper.SC"
            :type="'confirm'"
            icon="el-icon-delete"
            @click.native="remove(null)"
          >删除
          </myButton> -->
        </div>
      </div>
      <myTable
        ref="fileTable"
        :show-index="true"
        :loading.sync="taskLoading"
        :selection="false"
        :checked="taskChecked"
        :table-data="taskTableData"
        :d-c-authority="pageOper.DC"
        :total.sync="total"
        :page-index="taskListQuery.pageIndex"
        custom-label="操作"
        custom-label-width="180px"
        :row-key="rowKey"
        @clickTableRow="clickTable"
        @change="multiple"
        @pageSizeChange="taskPagerSizeChange"
        @pageCurrentChange="taskPagerCurrentChange"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span title="二维码" @click="qrCode('cay_2',scope.data.row)">
              二维码
            </span>
            <span :title="loginUser.userType == '企业'? '检查人员':'执行专家'" @click="selectUser(1, scope.data.row)">
              {{ loginUser.userType == '企业'? '检查人员':'执行专家' }}
            </span>
            <span v-if="loginUser.userType != '企业'" title="受检企业" @click="selectEnt(1, scope.data.row)">
              受检企业
            </span>
            <span
              v-if="pageOper.XG"
              title="编辑"
              @click="editTask(scope.data.row)"
            >
              编辑
            </span>
            <span
              v-if="pageOper.SC"
              title="删除"
              @click="removeTask(scope.data.row)"
            >
              删除
            </span>
          </myHandle>
        </template>
      </myTable>
    </el-col>
    <!-- 操作栏 -->
    <el-col :span="10">
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="detailListQuery.keyword"
            placeholder="任务名称"
            clearable
            class="input-short"
            @keyup.native.enter="detailSearch"
          />

          <!-- <el-button icon="el-icon-circle-close" circle @click="clearAll" /> -->
          <myButton
            v-if="pageOper.CX"
            :type="'search'"
            icon="el-icon-search"
            @click.native="detailSearch"
          >搜索</myButton>
        </div>
        <div class="right">
          <myButton
            v-if="pageOper.TJ"
            :type="'confirm'"
            icon="el-icon-plus"
            @click.native="editDetail(null)"
          >添加</myButton>
        </div>
      </div>
      <myTable
        ref="fileTable"
        :show-index="true"
        :loading.sync="detailLoaing"
        :selection="false"
        :checked="detailChecked"
        :table-data="detailTableData"
        :d-c-authority="pageOper.DC"
        :total.sync="detailTotal"
        :page-index="detailListQuery.pageIndex"
        custom-label="操作"
        custom-label-width="180px"
        :row-key="rowKey"
        @change="multipleDetail"
        @pageSizeChange="detailPagerSizeChange"
        @pageCurrentChange="detailPagerCurrentChange"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span title="二维码" @click="qrCode('cay_2',scope.data.row)">
              二维码
            </span>
            <span :title="loginUser.userType == '企业'? '检查人员':'执行专家'" @click="selectUser(0, scope.data.row)">
              {{ loginUser.userType == '企业'? '检查人员':'执行专家' }}
            </span>
            <span v-if="loginUser.userType != '企业'" title="受检企业" @click="selectEnt(0, scope.data.row)">
              受检企业
            </span>
            <span
              v-if="pageOper.XG"
              title="编辑"
              @click="editDetail(scope.data.row)"
            >
              编辑
            </span>
            <span
              v-if="pageOper.SC"
              title="删除"
              @click="detailRemove(scope.data.row)"
            >
              删除
            </span>
          </myHandle>
        </template>
      </myTable>
    </el-col>

    <editTask
      v-if="editTaskShow"
      :id="taskId"
      :title="taskTitleName"
      @close="editTaskColse"
    />
    <editDetail
      v-if="editDetailShow"
      :id="detailId"
      :task-id="taskId"
      :title="detailTitleName"
      @close="editDetailColse"
    />
    <selectUser
      v-if="selectUserShow"
      :task-id="taskId"
      :detail-id="detailId"
      :is-task="isTask"
      @close="selectUserClose"
    />
    <selectEnt
      v-if="selectEntShow"
      :task-id="taskId"
      :detail-id="detailId"
      :is-task="isTask"
      @close="selectEntClose"
    />
    <qrCode
      v-if="qrCodeShow"
      :url="qrUrl"
      @close="qrClose"
    />
  </div>
</template>

<script>
import { list, remove, enumList } from '@/api/hazard/task'
import {
  list as detailLsit,
  remove as detailRemove
} from '@/api/hazard/taskDetail'
import editTask from './editTask'
import editDetail from './editDetail'
import selectUser from './selectUser'
import selectEnt from './selectEnt'
import qrCode from './qrCode'

import { Message } from 'element-ui'

export default {
  name: 'Table',
  components: { editTask, editDetail, selectUser, selectEnt, qrCode },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),

      // 新增/修改 标题
      taskTitleName: null,
      // 数据列表加载动画
      taskLoading: true,
      detailLoaing: true,
      loginUser: JSON.parse(sessionStorage.getItem('loginUser') || '{}'),
      qrCodeShow: false,
      editTaskShow: false,
      taskId: null,
      detailId: null,
      editDetailShow: false,
      detailTitleName: null,
      isHight: true,
      selectUserShow: false,
      selectEntShow: false,
      isTask: 1,
      // 筛选列
      taskChecked: [
        { key: '计划名称', val: 'taskName', width: '190px' },
        { key: '负责人', val: 'principalName' },
        { key: '检查类型', val: 'inspectType' },
        { key: '执行时间', val: 'timeStr', width: '200px', align: 'center' },
        { key: '计划状态', val: 'taskState', align: 'center', width: '80px' }
      ],
      detailChecked: [
        { key: '任务名称', val: 'detailName' },
        { key: '任务时间', val: 'timeStr', width: '200px', align: 'center' },
        { key: '任务状态', val: 'detailState', width: '80px', align: 'center' }
      ],
      // 查询列表参数对象
      taskListQuery: {
        keyword: null,
        isMe: 0,
        inspectType: null,
        taskState: null,
        isEntrust: null,
        taskType: null,
        pageIndex: 1,
        pageSize: 10
      },
      detailListQuery: {
        taskId: null,
        time: null,
        pageIndex: 1,
        pageSize: 10
      },

      total: 0,
      detailTotal: 0,
      // 表格数据数组
      taskTableData: [],
      detailTableData: [],

      // 多选数据暂存数组
      multipleSelection: [],
      multipleSelectionDetail: [],
      timeStamp: 0,
      nowIndex: null,
      qrUrl: null,
      defaultShowNodes: [],
      taskTypeList: [],
      inspectTypeList: [],

      yesOrNoList: [],

      taskStateList: [],
      meList: [
        {
          key: '查看全部',
          value: 0
        },
        {
          key: '只看我的',
          value: 1
        }
      ]
    }
  },
  mounted() {
    this.getEnumList()
    this.getTaskMainData()
  },
  created() {},

  methods: {
    clickTable(row) {
      this.taskId = row.taskId
      this.detailListQuery.taskId = row.taskId
      this.getDetailMainData()
    },
    selectUser(isTask, data) {
      console.log(data)
      this.selectUserShow = true
      this.isTask = isTask
      this.taskId = data.taskId
      this.detailId = data.detailId
    },
    selectEnt(isTask, data) {
      console.log(data)
      this.selectEntShow = true
      this.isTask = isTask

      this.detailId = data.detailId
      this.taskId = data.taskId
    },
    qrCode(str, data) {
      if (str === 'cay_1') {
        this.qrUrl = str + data.taskId
      } else {
        this.qrUrl = str + data.detailId
      }
      this.qrCodeShow = true
    },
    qrClose() {
      this.qrCodeShow = false
    },
    editDetail(data) {
      // data 为 null 时添加
      console.log(data)
      if (data == null) {
        this.detailId = null
        this.detailTitleName = '新增任务'
      } else {
        this.detailId = data.detailId
        this.detailTitleName = '修改任务'
      }
      this.editDetailShow = true
    },
    getEnumList() {
      const that = this
      that.taskLoading = true
      enumList()
        .then((res) => {
          that.taskLoading = false
          that.taskTypeList = res.taskTypeList
          that.inspectTypeList = res.inspectTypeList

          that.yesOrNoList = res.yesOrNoList
          that.taskStateList = res.taskStateList
        })
        .catch(() => {
          that.taskLoading = false
        })
    },
    rowKey(row) {
      return row.userId
    },

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e
    },
    multipleDetail(e) {
      this.multipleSelectionDetail = e
    },

    // 清除所有搜索条件
    clearAll() {
      this.taskListQuery.entId = null
      this.taskListQuery.depId = null
      this.taskListQuery.userName = null
      this.search()
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.taskTableData = []
      this.getTaskMainData()
    },

    detailSearch() {
      this.detailTableData = []
      this.getDetailMainData()
    },

    /**
     * 分页数据加载
     */
    getTaskMainData() {
      const that = this
      this.taskLoading = true
      list(that.taskListQuery)
        .then((res) => {
          console.log(res)
          that.taskLoading = false
          that.detailLoaing = false
          that.taskTableData = res.records
          that.detailTableData = []

          if (that.taskTableData.length > 0) {
            that.detailListQuery.taskId = that.taskTableData[0].taskId
            that.taskId = that.taskTableData[0].taskId
            that.getDetailMainData()
          }

          that.total = res.total
        })
        .catch(() => {
          that.taskLoading = false
          that.detailLoaing = false
        })
    },
    getDetailMainData() {
      const that = this
      this.detailLoaing = true
      detailLsit(that.detailListQuery)
        .then((res) => {
          console.log(res)
          that.detailLoaing = false
          that.detailTableData = res.records

          that.detailTotal = res.total
        })
        .catch(() => {
          that.detailLoaing = false
        })
    },
    /**
     * 每页数量改变事件
     */
    taskPagerSizeChange(pageSize) {
      this.taskListQuery.pageSize = pageSize
      this.getTaskMainData()
    },
    /**
     * 页码改变事件
     */
    taskPagerCurrentChange(pageIndex) {
      this.taskListQuery.pageIndex = pageIndex
      this.getTaskMainData()
    },
    /**
     * 每页数量改变事件
     */
    detailPagerSizeChange(pageSize) {
      this.detailListQuery.pageSize = pageSize
      this.getDetailMainData()
    },
    /**
     * 页码改变事件
     */
    detailPagerCurrentChange(pageIndex) {
      this.detailListQuery.pageIndex = pageIndex
      this.getDetailMainData()
    },
    /**
     * 关闭编辑页面
     */
    editTaskColse(data) {
      this.editTaskShow = false
      if (data.reload) {
        this.getTaskMainData()
      }
    },
    editDetailColse(data) {
      this.editDetailShow = false
      if (data.reload) {
        this.getDetailMainData()
      }
    },
    selectUserClose() {
      this.taskId = null
      this.detailId = null
      this.selectUserShow = false
    },
    selectEntClose() {
      this.taskId = null
      this.detailId = null
      this.selectEntShow = false
    },
    /**
     * 编辑/添加按钮点击事件
     */
    editTask(data) {
      // data 为 null 时添加
      console.log(data)
      if (data == null) {
        this.taskId = null
        this.taskTitleName = '新增计划'
      } else {
        this.taskId = data.taskId
        this.taskTitleName = '修改计划'
      }
      this.editTaskShow = true
    },
    /**
     * 删除/批量删除事件
     */
    removeTask(data) {
      console.log(data)
      const that = this
      let deleteData = []

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.taskId)
        })
      } else {
        deleteData = [data.taskId]
        console.log(deleteData)
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
          this.taskLoading = true

          remove(deleteData)
            .then((res) => {
              Message({
                type: 'success',
                message: '操作成功'
              })
              that.getTaskMainData()
            })
            .finally(() => {
              that.taskLoading = false
              that.multipleSelection = []
              that.$refs.fileTable.$refs.multipleTable.clearSelection()
            })
        })
        .catch(() => {
          // 取消删除
        })
    },
    detailRemove(data) {
      console.log(data)
      const that = this
      let deleteData = []

      if (data == null) {
        that.multipleSelectionDetail.forEach((item) => {
          deleteData.push(item.detailId)
        })
      } else {
        deleteData = [data.detailId]
        console.log(deleteData)
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
          this.detailLoaing = true

          detailRemove(deleteData)
            .then((res) => {
              Message({
                type: 'success',
                message: '操作成功'
              })
              that.getDetailMainData()
            })
            .finally(() => {
              that.detailLoaing = false
              that.multipleSelectionDetail = []
              that.$refs.fileTable.$refs.multipleSelectionDetail.clearSelection()
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
.table-classic-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>
