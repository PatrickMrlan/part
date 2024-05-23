<template>
  <div class="toolsRight">
    <div v-show="menuShow" @click="screening" class="checkBox">
      <el-checkbox-group
        v-model="header"
        @change="handleCheck($event)"
        size="mini"
      >
        <el-checkbox
          v-for="(item, index) in checked"
          :key="index"
          :label="item.key"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <el-button icon="el-icon-printer" @click="printTable">打印</el-button>
    <el-button
      icon="el-icon-download"
      style="margin-right: 4px"
      @click="exportTable"
      >导出</el-button
    >
    <el-button icon="el-icon-menu" @click="screening">筛选列</el-button>
  </div>
</template>

<script>
import printJS from "print-js";
import { Message } from "element-ui";
import excel from "@/utils/excel";
// import { mapState, mapGetters } from 'vuex';
export default {
  data() {
    return {
      menuShow: false,
      key: [],
    };
  },
  created() {
    // this.getMainData();
    console.log(this.checked);
    this.key = JSON.parse(JSON.stringify(this.checked));
  },
  // computed: {
  //   ...mapState(['header','checked']),
  //   ...mapGetters(['getMessage']),
  // },
  methods: {
    handleCheck(event) {
      this.key = [];
      this.checked.forEach((item) => {
        event.forEach((val) => {
          if (item.key === val) {
            this.key.push(item);
          }
        });
      });
    },
    screening() {
      this.menuShow = !this.menuShow;
    },
    meneSelect() {
      this.menuShow = true;
    },
    /**
     * 打印表格
     */
    printTable() {
      printJS({
        printable: "print", // DOM id
        type: "html",
        scanStyles: false,
        style: "table { border-collapse: collapse; }",
      });
    },
    /**
     * 导出数据--excle格式
     */
    exportTable() {
      let key = [];
      this.key.forEach((item) => {
        key.push(item.val);
      });
      if (this.dataList.length) {
        const name = "报表管理_" + new Date().getTime();
        const params = {
          header: this.header,
          key: key,
          data: this.dataList,
          autoWidth: true,
          fileName: name,
          bookType: "xlsx", // 支持  xlsx，csv，txt
        };
        excel.exportDataToExcel(params);
      } else {
        Message({
          type: "error",
          message: "没有可导出的数据",
        });
      }
    },
  },
};
</script>

<style>
.toolsRight {
  display: flex;
  flex-direction: row-reverse;
  padding: 8px;
  background-color: #fafafa;
}

.checkBox {
  width: 150px;
  border: 1px solid #d1d2d3;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 16px 0 16px 16px;
  line-height: 20px;
  text-align: left;
  position: absolute;
  top: 98px;
  background-color: rgba(255, 255, 255, 0.9);
  right: 125px;
  z-index: 999;
}
</style>