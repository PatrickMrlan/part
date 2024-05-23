<template>
  <div class="table-classic-wrapper">
    <!-- 统计 -->
    <div class="totalNum boxShadow" ref="totalNum">
      <div>
        <div class="label">涉及的管控措施</div>
        <p>{{ ledgerInfo.measuresCount }}</p>
      </div>
      <div>
        <div class="label">检查标准数</div>
        <p>{{ ledgerInfo.standardCount }}</p>
      </div>
      <div>
        <div class="label">合格项</div>
        <p>{{ ledgerInfo.qualifiedCount }}</p>
      </div>
      <div>
        <div class="label">隐患项</div>
        <p class="hidden">{{ ledgerInfo.hiddenDangerCount }}</p>
      </div>
    </div>

    <!-- 搜索框 -->
    <div
      ref="appRowHeight"
      class="app-list-control app-row searchBox boxShadow"
    >
      <div class="flex">
        <el-input
          v-model.trim="listQuery.keyword"
          placeholder="请输入检查内容查询"
          clearable
          class="input-long"
          @keyup.native.enter="search"
        />

        <el-select
          v-model.trim="listQuery.riskPointId"
          class="input-normal"
          clearable
          filterable
          placeholder="请选择检查项目"
        >
          <el-option
            v-for="(item, index) in enumList.pointList"
            :key="index"
            :label="item.riskPointName"
            :value="item.riskPointId"
          />
        </el-select>

        <!-- <el-select
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
        </el-select> -->

        <el-select
          v-model.trim="listQuery.inspectionResults"
          class="input-normal"
          clearable
          filterable
          placeholder="请选择检查结果"
        >
          <el-option
            v-for="(item, index) in enumList.inspectionResults"
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
          >搜索</myButton
        >
      </div>
    </div>

    <div class="content boxShadow">
      <div class="item app-row" ref="item">
        <h3>管控台账</h3>
        <div class="right">
          <!-- <myButton v-if="pageOper.DC" icon="el-icon-upload2">导出</myButton> -->
        </div>
      </div>

      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          ref="multipleTable"
          v-loading="loading"
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          border
          :height="height"
          :default-expand-all="true"
          row-key="mockId"
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
          @row-click="clickTable"
        >
          <el-table-column label="检查项目" min-width="200">
            <template slot-scope="scope">
              <div style="display: inline-block">
                {{ scope.row.riskPointName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="measureName" label="检查内容">
          </el-table-column>
          <el-table-column prop="inspectionStandards" label="检查标准">
          </el-table-column>
          <el-table-column
            prop="postNames"
            label="负责人"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.postName">
                <i class="el-icon-user-solid" />
                {{ scope.row.postName }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="reviewStatus"
            label="最近巡检时间"
            width="120"
            align="center"
          >
          </el-table-column> -->
          <el-table-column
            prop="inspectionResults"
            label="检查结果"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <i
                  class="inspectionResultsIcon"
                  :style="{
                    backgroundColor:
                      scope.row.inspectionResults == '未检查'
                        ? '#b6b6b6'
                        : scope.row.inspectionResults == '隐患'
                        ? '#F5222D'
                        : scope.row.inspectionResults == '合格'
                        ? '#52C41A'
                        : '',
                  }"
                ></i>
                <span>{{ scope.row.inspectionResults }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
    
<script>
import { measuresList, enumList, ledger,safetyChecklist } from "@/api/risk/measures";

import { Message } from "element-ui";

export default {
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      listQuery: {
        keyword: null, // 内容
        inspectionResults: null, // 结果
        reviewStatus: null, // 状态
        riskPointId: null, // 项目
      },

      mockId: 1,

      loading: false,
      menuShow: false,
      height: null,
      total: 0,
      tableData: [],
      ledgerInfo: {},
      enumList: {}, // 枚举
    };
  },
  watch: {
    tableData() {
      this.$nextTick(() => {
        this.onResize();
      });
    },
  },
  created() {
    this.getEnumList();
    this.getMainData();
  },
  mounted() {
    this.$nextTick(() => {
      this.onResize();
    });
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    getEnumList() {
      enumList().then((res) => {
        this.enumList = res;
      });
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;

      ledger().then((res) => {
        that.ledgerInfo = res;
      });

      safetyChecklist(that.listQuery)
        .then((res) => {
          that.tableData = res;

          that.recursionTableData(that.tableData);
        })
        .finally(() => {
          that.loading = false;
        });
    },

    /**
     * 点击列表单行
     */
    clickTable(row) {
      this.$refs.multipleTable.toggleRowExpansion(row);
    },
    /**
     * 用递归算法对表格数据进行重构
     */
    recursionTableData(data) {

      console.log(data);

      if (data && data.length) {
        data.forEach((item) => {
          item.mockId = this.mockId++;
          // item.children = item.controlMeasuresList || item.measureStandardList;
          this.recursionTableData(item.children);
        });
      }
    },

    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },

    /**
     * 打开和关闭筛选列
     */
    screening() {
      this.menuShow = !this.menuShow;
    },

    handleCheck(event) {
      this.checked.forEach((item) => {
        item.isShow = false;
        event.forEach((val) => {
          if (item.headName == val) {
            item.isShow = true;
          }
        });
      });
      this.checked = JSON.parse(JSON.stringify(this.checked));
    },

    /**
     * 清空全部条件
     */
    clearAll() {
      this.listQuery.keyword = null;
      this.listQuery.inspectionResults = null;
      this.listQuery.reviewStatus = null;
      this.listQuery.riskPointId = null;
      this.search();
    },

    onResize() {
      this.height = window.innerHeight;
      let h1, h2, h3;
      if (this.$refs.totalNum.offsetHeight) {
        h1 = this.$refs.totalNum.offsetHeight;
      }
      if (this.$refs.appRowHeight.offsetHeight) {
        h2 = this.$refs.appRowHeight.offsetHeight;
      }
      if (this.$refs.item.offsetHeight) {
        h3 = this.$refs.item.offsetHeight;
      }

      this.height = this.height - h1 - h2 - h3 - 280;
    },
  },
};
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
  height: 106px;
  opacity: 1;
  & > div {
    width: calc(100% / 4);
    margin: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    .hidden {
      color: #f64b55;
    }
  }

  & > div:not(:last-child) {
    border-right: 1px solid #e8e8e8;
  }
}

.searchBox {
  background: #fff;
  padding: 24px 32px 14px;
}
.content {
  background: #fff;
  padding: 28px 32px;
  .item {
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 16px;
      font-family: "PingFang SC, PingFang SC";
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .table {
    margin-top: 24px;
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

.inspectionResultsIcon {
  width: 8px;
  height: 8px;
  background: transparent;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}
</style>
    