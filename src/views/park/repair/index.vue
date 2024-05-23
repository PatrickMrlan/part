<template>
  <div class="table-classic-wrapper">
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <div class="jianxiu">检修时间</div>

        <el-date-picker
          v-model="data"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>

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
          icon="el-icon-plus"
          @click.native="edit(null)"
          >添加</myButton
        >
        <myButton
          v-if="pageOper.SC"
          type="remove"
          icon="el-icon-delete"
          @click.native="remove(null)"
          >删除</myButton
        >
      </div>
    </div>
    <myTable
      ref="fileTable"
      :show-index="true"
      :selection="true"
      @change="multiple"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      :table-data="tableData"
      custom-label="操作"
      custom-label-width="200px"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :row-key="rowKey"
      :onResizeHeight="118"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
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
  </div>
</template>
<script>
import { list, remove } from "@/api/park/repair";
import edit from "./edit";

export default {
  components: { edit },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,

      // 多选数据暂存数组
      multipleSelection: [],

      timeStamp: 0,
      data: [],

      listQuery: {
        startData: null,
        endData: null,
        pageIndex: 1,
        pageSize: 10,
      },
      mapupShow: false,
      tableData: [],
      checked: [
        { key: "检修单位", val: "unitName", align: "center", width: "100px" },
        {
          key: "检修人",
          val: "repairName",
          align: "center",
          width: "100px",
        },
        {
          key: "检修时间",
          val: "time",
          align: "center",
          width: "120px",
        },
        {
          key: "保养性质",
          val: "nature",
          align: "center",
          width: "120px",
        },
        {
          key: "验收状态",
          val: "checkState",
          align: "center",
          width: "120px",
        },
        { key: "验收人", val: "checkUser", align: "center" },
        { key: "验收时间", val: "checkTime", align: "center" },
      ],
      total: 0,

      editId: null,
      editShow: false,
    };
  },
  async created() {
    await this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.parkUserId;
    },
    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e;
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      console.log(that.listQuery);
      list(that.listQuery)
        .then((res) => {
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
    /**
     * 查询按钮事件
     */
    search() {
      if (this.data.length && this.data) {
        this.listQuery.startData = this.data[0];
        this.listQuery.endData = this.data[1];
      }
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getMainData();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getMainData();
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
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      // data 为 null 时添加
      if (data == null) {
        this.editId = null;
        this.titleName = "新增维修记录";
      } else {
        this.editId = data.id;
        this.titleName = "修改维修记录";
      }
      this.editShow = true;
    },

    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },

    /**
     * 删除/批量删除事件
     */
    remove(data) {
      const that = this;
      let deleteData = [];
      if (data == null) {
        deleteData = that.multipleSelection;
      } else {
        deleteData.push(data);
      }
      console.log(deleteData);
      var ids = [];

      if (deleteData.length === 0) {
        that.$message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      } else {
        deleteData.forEach((item) => {
          ids.push(item.roleId);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          remove(ids)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.getMainData();
            })
            .finally(() => {
              that.loading = false;
              that.multipleSelection = [];
              that.$refs.fileTable.$refs.multipleTable.clearSelection();
            });
        })
        .catch(() => {
          // 取消删除
        });
    },
  },
};
</script>

<style lang="less" scoped>
.warnicon i {
  font-size: 60px;
  color: #ffb219;
  margin-right: 10px;
}
.headbox {
  display: flex;
  align-items: center;
  font-size: 14px;
  .headright {
    display: flex;
    &_box {
      margin: 0 30px;
    }
    .headright_box {
      margin: 0 20px;
      p {
        text-align: center;
      }
    }
  }
}

/deep/.topcard {
  margin-bottom: 20px;
}

.input-clong {
  width: 216px !important;
}

.block {
  height: calc(100vh - 290px);
  min-height: calc(100vh - 295px);
  overflow: auto;
}
.jianxiu {
  height: 32px;
  margin-right: 0px;
  background-color: #dcdfe6;
  background-image: none;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  line-height: 32px;
  outline: none;
  border-radius: 4px 0 0 4px;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.el-input__inner {
  border-radius: 0 4px 4px 0;
}
/deep/.el-date-editor .el-range-separator {
  min-width: 20px;
}
</style>
