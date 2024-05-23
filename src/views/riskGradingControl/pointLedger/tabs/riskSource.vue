<template>
  <div ref="box" class="box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in riskCategoryList"
        :key="index"
        :name="item.name"
        :value="item.value"
      >
        <template slot="label">
          <div>{{ item.key }}({{ item.num }})</div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="content">
      <div class="searchBox app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.keyword"
            placeholder="请输入名称、负责人查询"
            clearable
            class="input-long"
          />
          <!-- <el-select
            class="input-normal"
            placeholder="请选择风险等级"
            filterable
          ></el-select> -->

          <myButton
            type="search"
            icon="el-icon-search"
            @click.native="search"
          >搜索</myButton>
        </div>
        <div class="right">
          <!-- <myButton icon="el-icon-plus" @click.native="edit(null)"
            >添加</myButton
          > -->
        </div>
      </div>

      <div class="table">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          border
          :height="height"
          :header-cell-style="{
            height: '50px',
            fontSize: '14px',
            fontWeight: 'bold',
          }"
          :cell-style="{
            fontSize: '14px',
          }"
          :row-style="{
            cursor: 'pointer',
          }"
        >
          <el-table-column prop="riskName" label="名称" />
          <el-table-column
            prop="riskCategory"
            label="类别"
            align="center"
            width="120"
          />
          <el-table-column
            prop="riskLevel"
            label="风险等级"
            align="center"
            width="120"
          />
          <el-table-column
            prop="accidentTypeNames"
            label="主要事故类型"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            prop="riskOverview"
            label="风险概述"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            width="100"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <my-handle>
                <span
                  @click="editRiskSource(scope.row, scope.$index)"
                >编辑</span>
                <span @click="remove(scope.row)">删除</span>
              </my-handle>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <editRiskSource
      v-if="editRiskSourceShow"
      :id="editId"
      :title="titleName"
      :edit-data="editData"
      @close="editRiskSourceClose"
    />
  </div>
</template>

<script>
import { list, remove } from '@/api/risk/riskSource'
import { enumList } from '@/api/risk/riskPoint'
import editRiskSource from '../editRiskSource.vue'
import { Message } from 'element-ui'

export default {
  components: { editRiskSource },
  props: {
    riskSoureData: {
      required: false,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      listQuery: {
        riskPointId: null,
        keyword: null,
        riskCategory: null,
        pageIndex: 1,
        pageSize: 999999999
      },
      tableData: [],
      riskCategoryList: [],
      activeName: null,
      height: null,

      editRiskSourceShow: false,
      editId: null,
      editIndex: null,
      editData: null,
      titleName: null
    }
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.onResize()
      })
    }

  },

  mounted() {
    this.riskCategoryList = this.riskSoureData
    this.listQuery.riskPointId = this.$route.query.id

    this.getMainData()

    this.$nextTick(() => {
      this.onResize()
    })
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    /**
     * 编辑风险源（点）
     */
    editRiskSource(data, index) {
      console.log(data, index)

      this.editIndex = null
      this.editData = null
      this.editId = null

      if (data == null) {
        this.editId = null
        this.titleName = '新增风险源（点）'
      } else if (data.riskSourceId) {
        this.editId = data.riskSourceId
        this.titleName = '编辑风险源（点）'
      } else {
        this.editData = data
        this.editIndex = index + ''
        this.titleName = '编辑风险源（点）'
      }
      this.editRiskSourceShow = true
    },

    /**
     * 关闭编辑风险源（点）页面
     */
    editRiskSourceClose(data) {
      this.editRiskSourceShow = false

      if (data.reload) {
        this.getMainData()
        this.$parent.$parent.$parent.loadData()
        this.$forceUpdate()
      }
    },

    getMainData() {
      this.loading = true
      list(this.listQuery)
        .then((res) => {
          console.log(res)
          this.tableData = res.records
        })
        .finally(() => {
          this.loading = false
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
     * 删除
     */
    remove(data) {
      console.log(data)
      const that = this
      let deleteData = []

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.riskSourceId)
        })
      } else {
        deleteData = [data.riskSourceId]
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
              Message({
                type: 'success',
                message: '操作成功'
              })
              that.getMainData()
              that.$parent.$parent.$parent.loadData()
              that.$forceUpdate()
            })
            .finally(() => {
              that.loading = false
            })
        })
        .catch(() => {
          // 取消删除
        })
    },

    handleClick(tab, event) {
      this.listQuery.riskCategory = tab.$attrs.value
      this.getMainData()
    },

    resetTabs() {
      let num = 0

      this.riskCategoryList.forEach((item) => {
        num += item.num
      })

      this.activeName = this.riskCategoryList[0].name
    },

    addRows(table) {
      table.push({
        accidentType: null, // 事故类型
        possibility: null, // 可能性(L)
        seriousness: null, // 事故后果严重性(S)
        riskLevel: null // 风险等级
      })
    },

    delRows(table, index) {
      table.splice(index, 1)
    },
    onResize() {
      this.height = this.$refs.box.offsetHeight - 100 - 10
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-tabs__nav-scroll,
.content {
  padding: 0 20px;
}
.box {
  height: 100%;
}
</style>
