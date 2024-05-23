<template>
  <div class="table-classic-wrapper">
    <!-- 搜索框 -->
    <div
      ref="appRowHeight"
      class="app-list-control app-row searchBox boxShadow"
    >
      <div class="flex">
        <el-input
          v-model.trim="listQuery.keyword"
          placeholder="风险单元（场所、区域）名称"
          clearable
          class="input-long"
          @keyup.native.enter="search"
        />

        <el-select
          v-model.trim="listQuery.riskLevel"
          class="input-normal"
          clearable
          filterable
          placeholder="请选择风险等级"
        >
          <el-option
            v-for="(item, index) in enumList.riskLevelList"
            :key="index"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model.trim="listQuery.controlLevel"
          class="input-normal"
          clearable
          filterable
          placeholder="请选择管控层级"
        >
          <el-option
            v-for="(item, index) in enumList.controlLevelList"
            :key="index"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model.trim="listQuery.reviewStatus"
          class="input-normal"
          clearable
          filterable
          placeholder="请选择状态"
        >
          <el-option
            v-for="(item, index) in enumList.reviewStatusList"
            :key="index"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-button
          icon="el-icon-circle-close"
          style="margin-bottom: 10px"
          circle
          @click="clearAll"
        />

        <myButton
          v-if="pageOper.CX"
          type="search"
          icon="el-icon-search"
          @click.native="search"
        >搜索</myButton>
        <myButton
          v-if="pageOper.TJ"
          icon="el-icon-plus"
          style="margin-left: -10px"
          @click.native="edit(null)"
        >添加</myButton>
      </div>

      <div class="totalNum">
        <div>
          <div class="label">待确认</div>
          <p>{{ ledgerInfo.auditCount || 0 }}</p>
        </div>
        <div>
          <div class="label">风险单元（场所、区域）总数</div>
          <p>{{ ledgerInfo.pointCount || 0 }}</p>
        </div>
        <div>
          <div class="label">风险源（点）总数</div>
          <p>{{ ledgerInfo.sourceCount || 0 }}</p>
        </div>
      </div>
    </div>

    <div class="content boxShadow">
      <div ref="item" class="item app-row" />

      <div class="table">
        <div ref="toolsRight" class="toolsRight">
          <div
            v-show="menuShow"
            style="right: 0"
            class="checkBox"
            @click="screening"
          >
            <el-checkbox-group
              v-model="header"
              size="mini"
              @change="handleCheck($event)"
            >
              <el-checkbox
                v-for="(item, index) in checked"
                :key="index"
                :label="item.headName"
                :disabled="item.disabled"
              />
            </el-checkbox-group>
          </div>
          <!-- <myButton
            type="cancel"
            icon="el-icon-download"
            v-if="pageOper.DC"
            @click.native="getExportTableData"
            >导出</myButton
          > -->
          <myButton
            type="cancel"
            icon="el-icon-menu"
            @click.native.stop="screening"
          >筛选列</myButton>
          <myTip title="双击风险单元（场所、区域）进入详情" />
        </div>

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
          :default-expand-all="true"
          row-key="mockId"
          :header-cell-style="{
            height: '56px',
            fontSize: '14px',
            fontWeight: 'bold',
          }"
          :cell-style="{
            fontSize: '14px',
            color: '#000000E0',
          }"
          :row-style="{
            cursor: 'pointer',
            height: '56px',
          }"
          @row-dblclick="detail"
          @row-click="clickTable"
        >
          <el-table-column
            v-if="checked[0].isShow"
            label="风险单元（场所、区域）名称"
            min-width="300"
          >
            <template slot-scope="scope">
              <div
                style="display: inline-block"
                :title="scope.row.riskPointName"
              >
                <div v-if="scope.row.riskPointName" class="riskPointName">
                  <div class="type">风险单元（场所、区域）</div>
                  <div
                    class="name"
                    style="
                      color: #1677ff;
                      font-size: 18px;
                      font-weight: bold;
                      width: calc(70% - 30px);
                    "
                  >
                    {{ scope.row.riskPointName }}
                  </div>
                </div>

                <div v-else-if="scope.row.riskName" class="riskPointName">
                  <div class="type">风险源（点）</div>
                  <div class="name" style="font-size: 16px; font-weight: 600">
                    {{ scope.row.riskName }}
                  </div>
                </div>

                <div v-else-if="scope.row.accidentId" class="riskPointName">
                  <div class="type">事故类型</div>
                  <div class="name" style="font-size: 14px; color: #888">
                    {{ scope.row.accidentTypeKey }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checked[1].isShow"
            prop="riskLevel"
            label="风险等级"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span
                class="riskLevel"
                :class="
                  scope.row.riskLevel == '重大风险'
                    ? 'red'
                    : scope.row.riskLevel == '较大风险'
                      ? 'orange'
                      : scope.row.riskLevel == '一般风险'
                        ? 'yellow'
                        : scope.row.riskLevel == '低风险'
                          ? 'blue'
                          : ''
                "
              >{{ scope.row.riskLevel }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checked[2].isShow"
            prop="controlLevel"
            label="管控层级"
            width="150"
            align="center"
          />
          <el-table-column
            v-if="checked[3].isShow"
            prop="postNames"
            label="负责人"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.postNames">
                <i class="el-icon-user-solid" />
                {{ scope.row.postNames }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checked[4].isShow"
            prop="reviewStatus"
            label="状态"
            width="120"
            align="center"
          />
          <el-table-column
            v-if="checked[5].isShow"
            prop="controlStatus"
            label="是否管控"
            width="120"
            align="center"
          />
          <el-table-column
            label="操作"
            width="170"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <my-handle>
                <span
                  v-if="scope.row.riskPointName"
                  @click="copyPoint(scope.row)"
                >复制</span>
                <span v-if="scope.row.riskPointName">二维码</span>
                <span
                  v-if="pageOper.XG && scope.row.accidentId"
                  @click.stop="edit(scope.row)"
                >管控措施</span>
                <span
                  v-if="pageOper.XG && !scope.row.accidentId"
                  @click.stop="edit(scope.row)"
                >编辑</span>
                <span
                  v-if="pageOper.SC"
                  @click.stop="remove(scope.row)"
                >删除</span>
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
      @close="editClose"
    />
    <editMeasure
      v-if="editMeasureShow"
      :id="editId"
      :title="titleName"
      @close="editClose"
    />
  </div>
</template>

<script>
import {
  list,
  enumList,
  ledger,
  remove,
  auto,
  copyPoint
} from '@/api/risk/riskPoint'
import { remove as removeSource } from '@/api/risk/riskSource'
import { deleteMajor as removeMeasures } from '@/api/risk/measures'
import { nationalEconomyDetail } from '@/api/system/enterprise'
import { Message } from 'element-ui'
import editRiskSource from './editRiskSource.vue'
import editMeasure from './editMeasure.vue'

export default {
  components: { editRiskSource, editMeasure },

  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      listQuery: {
        keyword: null, // 名称
        riskLevel: null, // 风险等级
        controlLevel: null, // 管控层级
        reviewStatus: null, // 状态
        entId: null,
        pageIndex: 1,
        pageSize: 999999999
      },

      header: [
        '风险单元（场所、区域）名称',
        '风险等级',
        '管控层级',
        '负责人',
        '状态',
        '是否管控'
      ],

      checked: [
        {
          headName: '风险单元（场所、区域）名称',
          isShow: true,
          disabled: true
        },
        {
          headName: '风险等级',
          isShow: true,
          disabled: false
        },
        {
          headName: '管控层级',
          isShow: true,
          disabled: false
        },
        {
          headName: '负责人',
          isShow: true,
          disabled: false
        },
        {
          headName: '状态',
          isShow: true,
          disabled: false
        },
        {
          headName: '是否管控',
          isShow: true,
          disabled: false
        }
      ],
      mockId: 1,

      loading: false,
      menuShow: false,
      height: null,
      total: 0,
      tableData: [],
      ledgerInfo: {},
      enumList: {}, // 枚举

      editRiskSourceShow: false,
      editMeasureShow: false,
      editId: null,
      titleName: null,

      loginUser: {},
      isFirst: 1
    }
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.onResize()
      })
    }
  },
  created() {
    this.loginUser = JSON.parse(sessionStorage.getItem('loginUser'))
    this.listQuery.entId = this.loginUser.entId

    this.getEnumList()
    this.getMainData()
  },
  mounted() {
    this.$nextTick(() => {
      this.onResize()
    })
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    getEnumList() {
      enumList().then((res) => {
        this.enumList = res
      })
    },
    copyPoint(data) {
      const that = this

      that.loading = true
      this.$confirm('确认复制该风险单元（场所、区域）?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          copyPoint({ id: data.riskPointId })
            .then((res) => {
              that.loading = false
              Message({
                type: 'success',
                message: '操作成功'
              })
              that.getMainData()
            })
            .catch(() => {
              that.loading = false
            })
        })
        .finally(() => {
          that.loading = false
        })
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this
      this.loading = true

      ledger().then((res) => {
        that.ledgerInfo = res
      })

      list(that.listQuery)
        .then((res) => {
          that.tableData = res.records
          that.listQuery.pageSize = res.size
          that.listQuery.pageIndex = res.current
          that.total = res.total
          if (this.isFirst) {
            that.autoData()
          }

          that.recursionTableData(that.tableData)
        })
        .finally(() => {
          that.loading = false
        })
    },
    autoData() {
      const that = this
      that.isFirst = 0
      // 当前企业为家具业且没有风险点

      if (that.total === 0) {
        const entId = this.loginUser.entId
        if (entId) {
          nationalEconomyDetail({ entId: entId })
            .then((res) => {
              if (res && res.startsWith('enterprise_nationalEconomy_zzy_jjzzy')) {
                that.$confirm('系统检测到您所在企业属于家具行业，是否自动生成风险单元（场所、区域）', '提示', {
                  confirmButtonText: '确定生成',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  that.loading = true
                  auto({ data: 'enterprise_nationalEconomy_zzy_jjzzy' })
                    .then((res) => {
                      that.loading = false
                      Message({
                        type: 'success',
                        message: '操作成功'
                      })
                      that.getMainData()
                    })
                    .catch(() => {
                      that.loading = false
                    })
                }).catch(() => {

                })
              }
            })
            .finally(() => {
              that.loading = false
            })
        }
      }
    },
    /**
     * 点击列表单行
     */
    clickTable(row) {
      this.$refs.multipleTable.toggleRowExpansion(row)
    },
    /**
     * 用递归算法对表格数据进行重构
     */
    recursionTableData(data) {
      if (data && data.length) {
        data.forEach((item) => {
          item.mockId = this.mockId++
          item.children = item.riskSourceList || item.majorAccidentsList
          this.recursionTableData(item.children)
        })
      }
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
     * 打开和关闭筛选列
     */
    screening() {
      this.menuShow = !this.menuShow
    },

    handleCheck(event) {
      this.checked.forEach((item) => {
        item.isShow = false
        event.forEach((val) => {
          if (item.headName === val) {
            item.isShow = true
          }
        })
      })
      this.checked = JSON.parse(JSON.stringify(this.checked))
    },

    edit(data) {
      console.log(data)
      if (data == null) {
        this.$router.push({
          path: '/riskGradingControl/pointLedger/edit',
          query: {
            name: '新增风险单元（场所、区域）',
            id: null
          }
        })
      } else if (data.riskPointId) {
        this.$router.push({
          path: '/riskGradingControl/pointLedger/edit',
          query: {
            name: '编辑风险单元（场所、区域）',
            id: data.riskPointId
          }
        })
      } else if (data.riskSourceId) {
        this.titleName = '编辑风险源（点）'
        this.editId = data.riskSourceId
        this.editRiskSourceShow = true
      } else if (data.accidentId) {
        this.titleName = '管控措施'
        this.editId = data.accidentId
        this.editMeasureShow = true
      }
    },

    /**
     * 关闭编辑页面
     */
    editClose(data) {
      if (data.reload) {
        this.getMainData()
      }
      this.editRiskSourceShow = false
      this.editMeasureShow = false
    },

    detail(row) {
      if (row.riskPointId) {
        this.$router.push({
          path: '/riskGradingControl/pointLedger/detail',
          query: {
            name: '风险单元（场所、区域）详情',
            id: row.riskPointId
          }
        })
      }
    },

    // 列表删除
    remove(data) {
      console.log(data)
      const that = this
      let deleteData

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.riskPointId)
        })
      } else {
        if (data.riskPointId) {
          deleteData = [data.riskPointId]
        } else if (data.riskSourceId) {
          deleteData = [data.riskSourceId]
        } else if (data.accidentId) {
          deleteData = data
        }
      }

      if (deleteData.length === 0) {
        Message({
          type: 'warning',
          message: '请选择需要删除的数据!'
        })
        return
      }
      this.$confirm('确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true

          if (data.riskPointId) {
            remove(deleteData)
              .then((res) => {
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                that.search()
              })
              .finally(() => {
                that.loading = false
              })
          } else if (data.riskSourceId) {
            removeSource(deleteData)
              .then((res) => {
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                that.search()
              })
              .finally(() => {
                that.loading = false
              })
          } else if (data.accidentId) {
            removeMeasures(deleteData)
              .then((res) => {
                Message({
                  type: 'success',
                  message: '操作成功'
                })
                that.search()
              })
              .finally(() => {
                that.loading = false
              })
          }
        })
        .catch(() => {
          // 取消删除
        })
    },

    /**
     * 清空全部条件
     */
    clearAll() {
      this.listQuery.keyword = null
      this.listQuery.riskLevel = null
      this.listQuery.controlLevel = null
      this.listQuery.reviewStatus = null
      this.search()
    },

    onResize() {
      this.height = window.innerHeight
      let h2, h3

      if (this.$refs.appRowHeight.offsetHeight) {
        h2 = this.$refs.appRowHeight.offsetHeight
      }
      // if (this.$refs.item.offsetHeight) {
      //   h3 = this.$refs.item.offsetHeight;
      // }

      this.height = this.height - h2 - 255
    }
  }
}
</script>

<style lang="less" scoped>
.table-classic-wrapper {
  background: #f0f2f5;
  height: 100%;
  & > div:not(:last-child) {
    margin-bottom: 16px;
  }
}
.boxShadow {
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.16);
}
.totalNum {
  display: flex;
  background: #fff;
  opacity: 1;
  & > div {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      transition: 0.1s;
    }
    p {
      font-size: 24px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      transition: 0.1s;
    }
  }

  & > div:not(:last-child) {
    border-right: 1px solid #e8e8e8;
  }
  & > div:hover .label {
    color: #000000;
  }
  & > div:hover p {
    font-weight: bold;
    color: #006eff;
  }
}

.searchBox {
  background: #fff;
  padding: 24px 32px 14px;
}
.content {
  background: #fff;
  padding: 12px 20px;
  .item {
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 16px;
      font-family: "PingFang SC, PingFang SC";
      color: rgba(0, 0, 0, 0.85);
    }
  }
}

/deep/.tip {
  margin: 0 auto 0 0 !important;
  border: none !important;
  background: transparent !important;
}

.riskPointName {
  display: flex;
  width: 100%;
  .type {
    background: #fafafa;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.16);
    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
    padding: 0 5px;
    margin-right: 5px;
    min-width: min-content;
    max-width: calc(30% - 60px);
    white-space: nowrap;
  }
  .name {
    font-size: 14px;
    color: #000000;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.riskLevel {
  padding: 0 5px;
  border-radius: 4px;
}
.riskLevel.red {
  background: rgba(245, 34, 45, 0.1);
  border: 1px solid rgba(245, 34, 45, 0.15);
  color: rgba(245, 34, 45, 0.85);
}
.riskLevel.orange {
  background: rgba(249, 156, 55, 0.1);
  border: 1px solid rgba(249, 156, 55, 0.15);
  color: rgba(249, 156, 55, 0.85);
}
.riskLevel.yellow {
  background: rgba(249, 223, 54, 0.1);
  border: 1px solid rgba(249, 223, 54, 0.15);
  color: rgba(249, 223, 54, 0.85);
}
.riskLevel.blue {
  background: rgba(92, 181, 255, 0.1);
  border: 1px solid rgba(92, 181, 255, 0.15);
  color: rgba(92, 181, 255, 0.85);
}
</style>

