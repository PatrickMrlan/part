<template>
  <div class="my_table">
    <!-- 表格工具栏 -->
    <div v-show="showToolsRight" ref="toolsRight" class="toolsRight">
      <div v-show="menuShow" class="checkBox" @click="screening">
        <el-checkbox-group
          v-model="header"
          size="mini"
          @change="handleCheck($event)"
        >
          <el-checkbox
            v-for="(item, index) in checked"
            :key="index"
            :label="item.key"
          />
        </el-checkbox-group>
      </div>
      <myButton
        v-if="isPrintTable"
        :type="'cancel'"
        icon="el-icon-printer"
        @click.native="printTable"
        >打印</myButton
      >
      <myButton
        v-if="DCAuthority"
        :type="'cancel'"
        icon="el-icon-download"
        @click.native="getExportTableData"
        >导出</myButton
      >
      <myButton
        v-if="isScreening"
        :type="'cancel'"
        icon="el-icon-menu"
        @click.native.stop="screening"
        >筛选列</myButton
      >
      <myTip :title="tipTitle" v-if="showTip" />

      <div style="margin-right: auto">
        <slot name="customHeader" />
      </div>
    </div>
    <!-- 表格栏 -->
    <div id="printTable">
      <el-table
        ref="multipleTable"
        :key="tableStamp"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        highlight-current-row
        :height="height"
        :row-key="rowKey"
        :stripe="isStripe"
        :border="isBorder"
        :header-cell-style="{
          height: '50px',
          fontSize: '14px'
        }"
        :cell-style="{
          fontSize: '14px'
        }"
        :row-style="{
          cursor: 'pointer'
        }"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        @row-click="handleClickTableRow"
        @row-dblclick="rowDblclick"
        @cell-dblclick="cellDblclick"
        @cell-click="cellclick"
      >
        <el-table-column
          v-if="selection"
          :reserve-selection="true"
          type="selection"
          width="40"
          align="center"
          :selectable="selectable"
          :fixed="indexFixed"
        />
        <el-table-column
          v-if="showIndex"
          type="index"
          :index="indexMethod"
          align="center"
          :width="indexLabelWidth"
          :label="indexLabel"
          :fixed="indexFixed"
        />
        <el-table-column
          v-if="custom3Label"
          :label="custom3Label"
          :width="custom3LabelWidth"
          align="center"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <slot name="custom3" :data="scope" />
          </template>
        </el-table-column>
        <!-- 渲染数据 -->
        <el-table-column
          v-for="(item, index) in key"
          :key="index"
          :prop="item.val"
          :align="item.align || 'left'"
          :min-width="item.minWidth || ''"
          :width="item.width || ''"
          :show-overflow-tooltip="true"
          :label="item.key"
          :sortable="item.sortable"
          :fixed="item.fixed"
        />
        <el-table-column
          v-if="custom1Label"
          :label="custom1Label"
          :width="custom1LabelWidth"
          align="center"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <slot name="custom1" :data="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="custom2Label"
          :label="custom2Label"
          :width="custom2LabelWidth"
          align="center"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <slot name="custom2" :data="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="custom4Label"
          :label="custom4Label"
          :width="custom4LabelWidth"
          align="center"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <slot name="custom4" :data="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="customLabel"
          :label="customLabel"
          :width="customLabelWidth"
          :min-width="customLabelMinWidth"
          align="center"
          class="app-table-oper"
          :fixed="customFixed"
        >
          <template slot-scope="scope">
            <slot name="custom" :data="scope" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页栏 -->
    <div v-if="total !== null" class="app-pager">
      <el-pagination
        background
        :current-page.sync="pageIndexNew"
        :page-sizes="[10, 20, 50, 100, 300]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        :pager-count="5"
        @size-change="pagerSizeChange"
        @current-change="pagerCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import excel from "../../utils/excel";
import printJS from "print-js";
import { Message } from "element-ui";
export default {
  name: "MyTable",
  props: {
    // columnList: {
    //   type: Array,
    //   required: true,
    //   default() {
    //     return [];
    //   },
    // },
    tableData: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    checked: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    selection: {
      // 是否显示多选列
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    showIndex: {
      // 是否显示序号列
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    exportFileName: {
      // 导出excel文件名（+时间戳）
      type: String,
      required: false,
      default() {
        return null;
      }
    },
    customLabel: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom1Label: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom2Label: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom3Label: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom4Label: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    customLabelWidth: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    customLabelMinWidth: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom1LabelWidth: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom2LabelWidth: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom3LabelWidth: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    custom4LabelWidth: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    total: {
      type: Number,
      required: false,
      default() {
        return null;
      }
    },
    DCAuthority: {
      required: false,
      default() {
        return false;
      }
    },
    isScreening: {
      type: Boolean,
      required: false,
      default() {
        return true;
      }
    },
    // 是否显示表格工具栏
    showToolsRight: {
      type: Boolean,
      required: false,
      default() {
        return true;
      }
    },
    // onResize
    onResizeHeight: {
      required: false,
      default() {
        return true;
      }
    },
    isPrintTable: {
      type: Boolean,
      required: false,
      default() {
        return true;
      }
    },
    // 打印方式
    printMode: {
      type: Boolean,
      required: false,
      default() {
        return true;
      }
    },
    // 表格数组的唯一值
    rowKey: {
      required: false,
      default() {
        return " ";
      }
    },
    pageIndex: {
      required: false,
      default() {
        return 1;
      }
    },
    // 是否显示表格的边框  默认显示
    isBorder: {
      required: false,
      default() {
        return true;
      }
    },
    // 是否斑马纹  默认不显示
    isStripe: {
      required: false,
      default() {
        return false;
      }
    },
    // 操作按钮的固定悬浮   left/right
    customFixed: {
      required: false,
      default() {
        return "right";
      }
    },
    // 序号与选中框的固定悬浮   left/right
    indexFixed: {
      required: false,
      default() {
        return "left";
      }
    },
    // 序号列的名字
    indexLabel: {
      required: false,
      default() {
        return "序号";
      }
    },
    indexLabelBoolen: {
      required: false,
      default() {
        return false;
      }
    },
    indexLabelWidth: {
      required: false,
      default() {
        return 70;
      }
    },
    showTip: {
      required: false,
      default() {
        return false;
      }
    },
    tipTitle: {
      required: false,
      default() {
        return "双击进入详情";
      }
    },

    showHeight: {
      required: false,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      menuShow: false,
      key: [],
      header: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      // 多选数据暂存数组
      // multipleSelection: [],
      height: null,
      pageIndexNew: null,

      tableStamp: 1
    };
  },
  watch: {
    pageIndex(newdata) {
      this.pageIndexNew = newdata;
    },
    checked(val, oval) {
      this.header = this.checked.map(item => item.key);
      this.key = JSON.parse(JSON.stringify(this.checked));
    },
    tableData() {
      this.$nextTick(() => {
        this.onResize();
      });
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs["multipleTable"].doLayout();
    });
  },
  mounted() {
    this.menuShow = false;
    this.header = this.checked.map(item => item.key);
    this.key = JSON.parse(JSON.stringify(this.checked));
    window.addEventListener("click", event => {
      const e = event || window.event;
      if (e.target.className !== "el-checkbox__original") {
        this.menuShow = false;
      }
    });
    window.addEventListener("resize", this.onResize);
    this.changeButtonColor();
    setTimeout(() => {
      this.onResize();
    }, 50);
    this.pageIndexNew = this.pageIndex;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("click", event => {
      const e = event || window.event;
      if (e.target.className !== "el-checkbox__original") {
        this.menuShow = false;
      }
    });
  },
  computed: {
    ...mapGetters("app", ["themeColor"])
  },
  methods: {
    selectable(row, index) {
      if (row.selectionDisabled != undefined && row.selectionDisabled) {
        return false;
      } else {
        return true;
      }
    },

    onResize() {
      if (this.showHeight === 0) {
        this.height = window.innerHeight;
      } else {
        this.height = this.showHeight;
      }
      let h = 0;
      if (this.$refs.toolsRight.offsetTop) {
        h = this.$refs.toolsRight.offsetTop;
      }

      if (this.onResizeHeight == true) {
        this.height = this.height - h - 120;
      } else if (this.onResizeHeight == false) {
        this.height = this.height - h - 445;
      } else {
        this.height = this.height - h - this.onResizeHeight;
      }
      // console.log(this.height);
    },
    /**
     * 表格单选
     */
    handleCurrentChange(val) {
      this.currentRow = val;
      // console.log(val);
    },
    //默认选中
    RowSelection(arr) {
      const that = this;
      let list = [];
      //遍历表格的数据，再遍历需要在表格中反显的数据，两者的id一致
      that.tableData.forEach(item => {
        arr.forEach(val => {
          if (val.id === item.id) {
            // 把判断出来的默认表格数据push到创建的数组中
            list.push(item);
          }
        });
      });
      if (list) {
        //再遍历数组，将数据放入方法中
        list.forEach(row => {
          that.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }
    },
    /**
     * 表格多选回调事件
     */
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      this.$emit("change", val);
    },
    handleClickTableRow(val) {
      // this.multipleSelection = val;
      this.$emit("clickTableRow", val);
    },
    rowDblclick(val) {
      // this.multipleSelection = val;
      this.$emit("row-dblclick", val);
    },
    cellclick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    },
    cellDblclick(row, column, cell, event) {
      this.$emit("cell-dblclick", row, column, cell, event);
    },
    /**
     * 序号
     */
    indexMethod(index) {
      this.changeButtonColor();

      if (this.indexLabelBoolen) {
        return (
          "第" +
          ((this.pageIndexNew - 1) * this.listQuery.pageSize + index + 1) +
          "期"
        );
      } else {
        return (this.pageIndexNew - 1) * this.listQuery.pageSize + index + 1;
      }
    },
    /**
     * 把选择展示数据的名称存入key
     */
    handleCheck(event) {
      this.key = [];
      this.checked.forEach(item => {
        event.forEach(val => {
          if (item.key === val) {
            this.key.push(item);
          }
        });
      });
    },
    /**
     * 打开和关闭筛选列
     */
    screening() {
      this.menuShow = !this.menuShow;
    },
    meneSelect() {
      this.menuShow = true;
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      // this.listQuery.pageSize = pageSize;
      this.$emit("pageSizeChange", pageSize);
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      // this.listQuery.pageIndex = pageIndex;
      this.$emit("pageCurrentChange", pageIndex);
    },

    /**
     * 获取导出表格的数据
     */
    getExportTableData() {
      if (this.total > 0) {
        this.$emit("getExportTableData", this.total);
      } else {
        Message({
          type: "warning",
          message: "没有可导出的数据"
        });
      }
    },
    /**
     * 导出数据--excle格式
     */
    exportTable(data) {
      const key = [];
      this.key.forEach(item => {
        key.push(item.val);
      });
      if (data.length) {
        let name = "";
        if (this.exportFileName) {
          name = this.exportFileName + new Date().getTime();
        } else {
          name = this.$route.query.name + new Date().getTime();
        }
        const params = {
          header: this.header,
          key: key,
          data: data,
          autoWidth: true,
          fileName: name,
          bookType: "xlsx" // 支持  xlsx，csv，txt
        };
        excel.exportDataToExcel(params);
      } else {
        Message({
          type: "warning",
          message: "没有可导出的数据"
        });
      }
    },
    /**
     * 打印表格
     */
    printTable() {
      if (this.tableData.length == 0) {
        return this.$message({
          type: "warning",
          message: "没有可打印的数据"
        });
      }

      let tab = this.tableData;
      tab.forEach(item => {
        for (let key in item) {
          item[key] = item[key] || "";
        }
      });

      this.key.forEach(item => {
        item.field = item.val;
        item.displayName = item.key;
      });
      let size = 100 / this.key.length;
      this.key.forEach((item, index) => {
        item.field = item.val;
        item.displayName = item.key;
        item.columnSize = size + `%`;
      });
      console.log(this.key);

      // {field: 'account', displayName: '还款账号', columnSize: `25%`},

      if (this.printMode) {
        printJS({
          printable: this.tableData, // DOM id
          type: "json",
          properties: this.key,
          scanStyles: false,
          targetStyles: ["*"], // 打印内容使用所有HTML样式，没有设置这个属性/值，设置分页打印没有效果
          style:
            "table { border-collapse: collapse; page-break-inside: avoid;page-break-after: avoid;page-break-before: avoid;}"
        });
      }
    },
    /**
     * 改变按钮颜色
     */
    changeButtonColor() {
      var number = document.querySelectorAll(
        ".app-pager .el-pagination .el-pager .number"
      );
      var active = document.querySelectorAll(
        ".app-pager .el-pagination .el-pager .active"
      );
      number.forEach(item => {
        item.style.background = "#f4f4f5";
      });
      active.forEach(item => {
        item.style.background = this.themeColor;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.my_table {
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  .toolsRight {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding: 8px;
    background-color: #fff;
  }

  .checkBox {
    width: max-content;
    border: 1px solid #d1d2d3;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 16px;
    line-height: 20px;
    text-align: left;
    position: absolute;
    top: 48px;
    background-color: rgba(255, 255, 255, 0.9);
    right: 125px;
    z-index: 999;

    /deep/.el-checkbox-group {
      display: flex;
      flex-direction: column;
      .el-checkbox {
        margin-right: 0;
      }
    }
  }
  .el-table thead {
    color: #101010;
    font-weight: bold;
    font-size: 24px;
  }
  .app-pager {
    padding-bottom: 10px;
  }
}
/deep/ .el-pagination {
  padding: 2px 20px !important;
}

/deep/.tip {
  margin: 0 auto 0 0 !important;
  border: none !important;
  background: transparent !important;
}
</style>
