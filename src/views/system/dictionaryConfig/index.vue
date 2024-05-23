<template>
  <div class="table-classic-wrapper">
    <el-row :gutter="20">
      <el-col :span="24">
        <div ref="appRowHeight" class="appRowHeight">
          <div class="app-list-control app-row">
            <div />
            <div class="right">
              <myButton
                v-if="pageOper.TJ"
                :type="'confirm'"
                icon="el-icon-plus"
                @click.native="edit(null)"
              >添加
              </myButton>
            </div>
          </div>
        </div>
        <div class="content">
          <el-table
            ref="refTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            row-key="id"
            border
            :header-cell-style="{ height: '30px !important', fontSize: '14px' }"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            select-on-indeterminate
            :height="screenHeight"
            @row-click="clickTable"
          >
            <el-table-column prop="name" label="字典名称" min-width="180" fixed>
              <template slot-scope="scope">
                <span :style="{ marginLeft: scope.row.empty ? '22px' : '' }">{{
                  scope.row.name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="字典编码"
              align="left"
              min-width="120"
            />

            <el-table-column
              prop="sort"
              label="排序"
              width="100"
              align="center"
            />

            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="150"
              class="app-table-oper"
            >
              <template slot-scope="scope">
                <myHandle>
                  <span
                    v-if="pageOper.TJ"

                    title="添加"
                    @click.stop="add(scope.row)"
                  >添加</span>
                  <span
                    v-if="pageOper.XG"
                    title="编辑"
                    @click.stop="edit(scope.row)"
                  >
                    编辑
                  </span>
                  <span
                    v-if="pageOper.SC"
                    title="删除"
                    @click.stop="remove(scope.row)"
                  >
                    删除
                  </span>
                </myHandle>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <edit
      v-if="editShow"
      :id="editId"
      :title="titleName"
      :pnode="selectNode"
      :pid="pid"

      @close="editColse"
    />

  </div>
</template>

<script>
import { list, remove } from '@/api/system/dictionary'
import { Message } from 'element-ui'
import edit from './edit'
export default {
  name: 'Table',
  components: { edit },
  data() {
    return {
      // 新增/修改 标题
      titleName: null,
      /**
         * 此页面的操作权限
         */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      editShow: false,
      tableData: [],
      selectNode: null,
      editId: null,
      pid: null,

      screenHeight: null
    }
  },
  mounted() {
    this.getMainData()
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.screenHeight = window.innerHeight - 210
      const h = this.$refs.appRowHeight.offsetHeight
    },
    getMainData() {
      this.loading = true
      list()
        .then(res => {
          this.loading = false

          this.tableData = res
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
       * 编辑页关闭事件
       */
    editColse(data) {
      this.editShow = false
      if (data.reload) {
        this.getMainData()
      }
    },
    /**
       * 新增
       */
    add(data) {
      this.pid = null
      if (data) {
        this.pid = data.id
      }
      this.selectNode = null
      this.editId = null
      this.editShow = true
      this.titleName = '新增字典'
    },
    /**
       * 编辑/修改
       */
    edit(data) {
      this.selectNode = null
      this.editId = null
      this.pid = null
      if (data) {
        this.selectNode = data
        this.editId = data.id
        this.pid = data.pid
        this.titleName = '修改字典管理'
      } else {
        this.titleName = '新增字典管理'
      }
      this.editShow = true
    },
    /**
       * 删除
       */
    remove(data) {
      this.$confirm('确认删除' + data.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          remove({id:data.id})
            .then(res => {
              this.loading = false
              Message({
                type: 'success',
                message: '操作成功'
              })
              this.getMainData()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          // 取消删除
        })
    },

    clickTable(row) {
      this.$refs.refTable.toggleRowExpansion(row)
    }
  }
}
</script>

  <style lang="less" scoped>
  .table-classic-wrapper {
    .content {
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    }

    .appRowHeight {
      display: flex;
      font-size: 14px;
      justify-content: left;
      align-items: center;
    }

    .app-list-control {
      display: flex;
      align-items: center;
    }

    .el-card {
      min-height: 656px;
    }

    .control-btns {
      margin-bottom: 20px;
    }

    .search-form {
      padding-top: 18px;
      margin-bottom: 15px;
      background-color: #f7f8fb;
    }

    .el-table thead {
      font-weight: 600;

      th {
        background-color: #f2f3f7;
      }
    }

    .upload-box,
    .export-data {
      width: 300px;
      margin: 0 auto 30px;
    }

    .upload-box {
      width: 156px;

      .files-upload {
        color: #20a0ff;
      }
    }

    .hints {
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }
  }

  /deep/.el-table__row {
    cursor: pointer;
  }
  </style>

