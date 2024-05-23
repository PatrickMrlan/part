<template>
  <div class="table-classic-wrapper">
    <el-card class="box-card topcard">
      <div class="headbox">
        <div class="headright">
          <div class="headright_box">
            <p>企业总数</p>
            <p>{{ ledgeritem.total || 0 }}</p>
          </div>
          <div class="headright_box">
            <p>新注册企业数</p>
            <p>{{ ledgeritem.registerCount || 0  }}</p>
          </div>
          <div class="headright_box">
            <p>待审核企业数</p>
            <p>{{ ledgeritem.auditCount || 0  }}</p>
          </div>
          <div class="headright_box">
            <p>正常企业数</p>
            <p>{{ ledgeritem.normalCount || 0  }}</p>
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
          v-model="listQuery.value"
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
          placeholder="行业领域"
          :normalizer="treeSelectNormalizer"
          :show-count="true"
          @select="selectDep($event.id)"
          no-results-text="未找到相关结果"
          no-options-text="没有可选择的数据"
        />
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

      <div class="right">
        <myButton
          v-if="pageOper.TJ"
          :type="'confirm'"
          icon="el-icon-plus"
          @click.native="edit(null)"
          >添加</myButton
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
      custom-label-width="280px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="140"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span v-if="scope.data.row.entState === '正常'">风险管理</span>
          <span v-if="scope.data.row.entState === '正常'">隐患排查</span>
          <span @click="detail(scope.data.row)">查看</span>
          <!-- <span
            v-if="
              pageOper.SH &&
              scope.data.row.entState === '待审核' &&
              scope.data.row.entLocation === '园内企业'
            "
            title="审核"
            @click="process(scope.data.row)"
          >
            审核
          </span> -->
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)"
            >编辑</span
          >
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>
    <edit
      v-if="editShow"
      :visible="editShow"
      :id="editId"
      :title="titleName"
      @close="editClose"
    />
  </div>
</template>
<script>
import {
  list,
  ledger,
  remove,
  enumList,
  entReview,
} from "@/api/system/enterprise";
import treeselect from "@riophae/vue-treeselect";
import edit from "./edit";
export default {
  components: { edit, treeselect },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      listQuery: {
        keyword: null,
        industrySector: null,
        pageIndex: 1,
        pageSize: 10,
      },
      value: null,
      checked: [
        { key: "企业名称", val: "entName",},
        {
          key: "企业综合风险等级",
          val: "aaa",
          align: "center",
          width: "150px",
        },
        { key: "行业分类", val: "industrySectorKey", align: "center",width: "120px" },
        { key: "管控层级", val: "aaa", align: "center",width: "120px" },
        { key: "企业状态", val: "entState", align: "center", width: "100px" },
      ],
      loginUser: {},
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      editShow: false,
      editId: null,
      titleName: null,
      entStateList: [],
      industrySectorList: [],
      ledgeritem: {}, //台账
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    await this.getlist();
    await this.getenumList();
    await this.getledger();
  },
  methods: {
    rowKey(row) {
      return row.entId;
    },
    //台账
    getledger() {
      ledger().then((res) => {
        this.ledgeritem = res;
      });
    },
    //枚举
    getenumList() {
      enumList().then((res) => {
        this.industrySectorList = res.industrySectorList;
        this.classificationList = res.classificationList;
        this.entStateList = res.entStateList;
      });
    },
    multiple(e) {
      // console.log(e);
      this.multipleSelection = e;
    },
    getlist() {
      const that = this;
      this.loading = true;
      list(that.listQuery)
        .then((res) => {
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
        children: node.children,
      };
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.entId) {
        this.editId = data.entId;
        this.titleName = "编辑企业";
      } else {
        this.editId = null;
        this.titleName = "新增企业";
      }
      this.editShow = true;
    },
    /**
     * 关闭编辑页面
     */
    editClose(data) {
      this.editShow = false;
      if (data.reload) {
        this.getlist();
      }
    },
    //详情
    detail(data) {
      this.$router.push({
        path: "/system/enterprise/detail",
        query: {
          name: "企业详情",
          id: data.entId,
          type: "ent",
        },
      });
    },
    //删除
    remove(data) {
      const that = this;
      let deleteData = [];
      let isNormalAccountFound = false; // 增加一个标志来跟踪是否找到正常账户

      if (data == null) {
        for (let item of that.multipleSelection) {
          if (item.entState == "正常") {
            that.$message({
              type: "warning",
              message: "正常账号不能删除!",
            });
            isNormalAccountFound = true;
            break; // 找到正常账号后立即停止循环
          }
          deleteData.push(item.entId);
        }
      } else {
        deleteData = [data.entId];
      }

      if (isNormalAccountFound || deleteData.length === 0) {
        // 检查标志或者deleteData为空
        if (!isNormalAccountFound) {
          that.$message({
            type: "warning",
            message: "请选择需要删除的数据!",
          });
        }
        return;
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          remove(deleteData)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.getlist();
            })
            .finally(() => {
              that.loading = false;
              that.multipleSelection = [];
              that.$refs.fileTable.$refs.multipleTable.clearSelection();
            });
        })
        .catch(() => {
          that.loading = false;
          // 取消删除
        });
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
     * 清空全部条件
     */
    clearAll() {
      this.listQuery.industrySector = null;
      this.listQuery.keyword = null;
      this.search();
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
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    },
    findIndex(arr, key, value) {
      return arr.findIndex((obj) => obj[key] === value);
    },
    //审核
    process(data) {
      console.log(data);
      this.$confirm("请选择审核是否通过？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "同意",
        cancelButtonText: "拒绝",
      })
        .then(() => {
          const index = this.findIndex(this.entStateList, "key", "正常");
          let obj = {
            ids: [data.entId],
            value: this.entStateList[index].value,
          };
          console.log(index);
          entReview(obj).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getlist();
          });
        })
        .catch((action) => {
          if (action === "cancel") {
            const index = this.findIndex(
              this.entStateList,
              "key",
              "审核不通过"
            );
            let obj = {
              ids: [data.entId],
              value: this.entStateList[index].value,
            };
            entReview(obj).then((res) => {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.getlist();
            });
          }
        });
    },
  },
};
</script>
<style scoped lang="less">
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
