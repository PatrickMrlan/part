<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="headright">
          <div class="headright_box">
            <p>企业总数</p>
            <p>0</p>
          </div>
          <div class="headright_box">
            <p>未评级企业</p>
            <p>0</p>
          </div>
          <div class="headright_box">
            <p>园区评定企业</p>
            <p>0</p>
          </div>
          <div class="headright_box">
            <p>近30等级变化企业</p>
            <p>0</p>
          </div>
        </div>
      </div>
    </el-card>
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入企业名称进行检索"
          class="input-long"
          @keyup.enter.native="search"
          clearable
        ></el-input>

        <el-select
          v-model="listQuery.keyword"
          placeholder="风险等级"
          class="input-normal"
          clearable
        >
          <!-- <el-option
            v-for="item in industrySectorList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          >
          </el-option> -->
        </el-select>

        <treeselect
          class="input-normal"
          v-model="listQuery.industrySector"
          :single="true"
          :clearable="true"
          :options="industrySectorList"
          placeholder="行业分类"
          :normalizer="treeSelectNormalizer"
          :show-count="true"
          @select="selectDep($event.id)"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
        />

        <el-select
          v-model="listQuery.keyword"
          placeholder="状态"
          class="input-normal"
          clearable
        >
          <!-- <el-option
            v-for="item in industrySectorList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          >
          </el-option> -->
        </el-select>
        <el-button
          icon="el-icon-circle-close"
          style="margin-bottom: 10px"
          circle
          @click="clearAll"
        />
        <myButton
          v-if="pageOper.CX"
          :type="'search'"
          icon="el-icon-search"
          @click.native="search"
          >搜索</myButton
        >
      </div>
    </div>
    <myTable
      ref="fileTable"
      :show-index="true"
      @change="multiple"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      custom-label="操作"
      custom-label-width="200px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="128"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span v-if="scope.data.row.entState === '正常'">风险管理</span>
          <span v-if="scope.data.row.entState === '正常'">隐患排查</span>
          <span>更多</span>
        </myHandle>
      </template>
    </myTable>
  </div>
</template>

<script>
import { list, enumList } from "@/api/system/enterprise";
import treeselect from "@riophae/vue-treeselect";
export default {
  components: {
    treeselect
  },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      listQuery: {
        industrySector: null,
        parkId: null,
        pageIndex: 1,
        pageSize: 10
      },
      checked: [
        { key: "企业名称", val: "entName", align: "center", width: "200px" },
        {
          key: "企业自评",
          val: "entNature",
          align: "center",
          width: "150px"
        },
        { key: "行业分类", val: "industrySector", align: "center" },
        { key: "管控层级", val: "district", align: "center" },
        { key: "负责人", val: "contact", align: "center", width: "100px" }
      ],
      loginUser: {},
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      editId: null,
      industrySectorList: []
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.loginUser.sysPark) {
      this.listQuery.parkId = this.loginUser.sysPark.parkId;
    } else {
      this.$message({
        type: "warning",
        message: "当前用户暂无园区!"
      });
    }
    await this.getlist();
    await this.getenumList();
  },
  methods: {
    getenumList() {
      enumList().then(res => {
        this.industrySectorList = res.industrySectorList;
      });
    },
    getlist() {
      const that = this;
      this.loading = true;
      list(that.listQuery)
        .then(res => {
          console.log(res);
          that.loading = false;
          that.tableData = res.records;
          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    clearAll() {
      this.listQuery.userIdentity = null;
      this.search();
    },
    selectDep(data) {
      console.log(this.listQuery);
    },
    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children
      };
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getlist();
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getlist();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getlist();
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
        .then(res => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.headbox {
  display: flex;
  align-items: center;
  font-size: 14px;
  .headright {
    width: 100%;
    display: flex;
    justify-content: space-around;
    &_box {
      margin: 0 20px;
    }
    .headright_box {
      margin: 0 20px;
      p {
        text-align: center;
      }
    }
  }
}
.headright_box > :nth-child(2) {
  font-size: 18px;
  font-weight: 600;
}
/deep/.topcard {
  margin-bottom: 20px;
}
/deep/.vue-treeselect__control {
  height: 32px;
  line-height: 32px;
}
</style>
