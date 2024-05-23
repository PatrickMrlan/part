<template>
  <div class="table-classic-wrapper">
    <div class="app-list-control app-row" ref="appRowHeight">
      <div class="flex"></div>
      <div class="right">
        <myButton
          v-if="pageOper.TJ"
          :type="'confirm'"
          icon="el-icon-plus"
          @click.native="edit(null)"
          >添加</myButton
        >
        <myButton
          v-if="pageOper.SC"
          :type="'confirm'"
          icon="el-icon-delete"
          @click.native="remove(null)"
          >删除</myButton
        >
      </div>
    </div>
    <myTable
      ref="fileTable"
      :showIndex="true"
      :selection="true"
      :checked="checked"
      :loading.sync="loading"
      :tableData.sync="tableData"
      :DCAuthority="pageOper.DC"
      :total.sync="total"
      :pageIndex="listQuery.pageIndex"
      customLabel="操作"
      customLabelWidth="120px"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :rowKey="rowKey"
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
import { list, remove } from "@/api/system/operationManagement";
import { Message } from "element-ui";
import edit from "./edit";

export default {
  name: "Table",
  components: { edit },
  data() {
    return {
      // 新增/修改 标题
      titleName: null,
      editShow: false,
      editId: null,
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      tableData: [],
      listQuery: {
        configureTypeId: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 筛选列
      checked: [
        { key: "操作名称", val: "operateName", align: "center" },
        { key: "操作标识", val: "operateValue", align: "center" },
        { key: "是否系统操作", val: "isSystem", align: "center" },
        { key: "排序", val: "sort", align: "center" },
        // { key: "添加时间", val: "addTime", align: "center" },
      ],
      menuShow: false,
      screenHeight: null,
      multipleSelection: [],
    };
  },
  mounted() {
    this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    /**
     * 搜索
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },
    getMainData() {
      const that = this;
      this.loading = true;
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
     * 编辑页关闭事件
     */
    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    /**
     * 编辑/修改
     */
    edit(data) {
      if (data) {
        this.editId = data.id;
        this.titleName = "修改操作管理";
      } else {
        this.editId = null;
        this.titleName = "新增操作管理";
      }
      this.editShow = true;
    },
    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e;
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
     * 删除
     */
    remove(data) {
      console.log(data);
      const that = this;
      let deleteData = [];

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.id);
        });
      } else {
        deleteData = [data.id];
        console.log(deleteData);
      }

      if (deleteData.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
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
              Message({
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
.table-classic-wrapper {
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
</style>
