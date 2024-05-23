<template>
  <div>
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="搜索内容"
          clearable
          class="input-long"
          @keyup.native.enter="search"
        />
        <el-select
          v-model="listQuery.accidentType"
          filterable
          class="input-normal"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in enumList.riskAccidentTypeList"
            :key="index"
            :label="item.dictName"
            :value="item.dictCode"
          />
        </el-select>
        <myButton
          v-if="pageOper.CX"
          type="search"
          icon="el-icon-search"
          @click.native="search"
          >搜索</myButton
        >
      </div>
      <div class="right">
        <!-- <myButton
            v-if="pageOper.DR"
            icon="el-icon-upload2"
            @click.native="upload(null)"
            >导入</myButton
          > -->
        <myButton
          v-if="type && multipleSelection.length > 0"
          icon="el-icon-refresh"
          @click.native="reset"
          >重置已选中（{{ multipleSelection.length }}）个</myButton
        >
        <myButton v-if="type" icon="el-icon-check" @click.native="check(null)"
          >选择</myButton
        >
        <myButton
          v-if="pageOper.TJ && !type"
          icon="el-icon-plus"
          @click.native="edit(null)"
          >添加</myButton
        >
        <myButton
          v-if="pageOper.SC && !type"
          type="remove"
          icon="el-icon-delete"
          @click.native="remove(null)"
          >删除</myButton
        >
      </div>
    </div>
    <myTable
      ref="fileTable"
      :rowKey="rowKey"
      :show-index="true"
      :selection="true"
      :checked="checked"
      :on-resize-height="type ? false : true"
      :loading.sync="loading"
      :table-data.sync="tableData"
      :d-c-authority="pageOper.DC"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      :custom-label="type ? null : '操作'"
      custom-label-width="120px"
      exportFileName="隐患标准"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
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

    <edit
      v-if="editShow"
      :visible="editShow"
      :id="editId"
      :categoryId="listQuery.categoryId"
      :title="titleName"
      @close="editClose"
    />
  </div>
</template>

<script>
import edit from "./edit.vue";
import {
  remove,
  enumList,
  list,
  addStandardByTemplate,
} from "@/api/hazard/standard";
export default {
  components: { edit },
  props: {
    type: {
      require: false,
      default() {
        return false;
      },
    },
    objectId: {
      require: false,
      default() {
        return null;
      },
    },
    tags: {
      require: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      timeStamp: 0,
      editShow: false,
      titleName: null,
      editId: null,
      listQuery: {
        accidentType: null,
        categoryId: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      multipleSelection: [],
      checked: [
        { key: "风险类型", val: "accidentTypeNames" },
        { key: "检查内容", val: "checkContent" },
        { key: "主要事故隐患或问题", val: "mainRisk", minWidth: "150px" },
        {
          key: "不合规的名称、条款和内容",
          val: "accordance",
          minWidth: "200px",
        },
      ],
      enumList: {},
    };
  },
  created() {
    this.getEnumList();
    if (this.type) {
      this.getMainData();
    }
  },
  mounted() {
    console.log(this.tags);
    if (this.type) {
      if (this.tags.length > 0) {
        this.$nextTick(() => {
          this.tags.forEach((item) => {
            console.log(item);
            this.$refs.fileTable.$refs.multipleTable.toggleRowSelection(item);
          });
        });
      }
    }
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
      this.loading = true;

      list(this.listQuery)
        .then((res) => {
          this.tableData = res.records;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 搜索
     */
    search() {
      this.tableData = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },

    rowKey(row) {
      return row.standardId;
    },

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = [];
      if (e && e.length) {
        e.forEach((item) => {
          this.multipleSelection.push(item.standardId);
        });
      }
    },

    check() {
      const that = this;
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择数据!",
        });
        return;
      }

      this.loading = true;
      addStandardByTemplate({
        objectId: this.objectId,
        objectIdList: this.multipleSelection,
      })
        .then((res) => {
          that.$parent.$parent.$parent._props.cancel(true);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 重置
    reset() {
      // 清空所有选中的行
      this.$refs.fileTable.$refs.multipleTable.clearSelection();
      this.multipleSelection = [];
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
     * 删除/批量删除事件
     */
    remove(data) {
      const that = this;
      let deleteData = [];
      if (data == null) {
        deleteData = that.multipleSelection;
      } else {
        deleteData = [data.standardId];
      }

      if (deleteData.length === 0) {
        that.$message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      }

      that
        .$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          that.loading = true;
          remove(deleteData)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.search();
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

    edit(data) {
      console.log(data);
      if (data) {
        this.titleName = "编辑标准";
        this.editId = data.standardId;
      } else {
        this.titleName = "添加标准";
        this.editId = null;
      }

      console.log(this.editId);
      this.editShow = true;
    },

    /**
     * 关闭编辑页面
     */
    editClose(data) {
      if (data.reload) {
        if (data.type == "table") this.getMainData();
      }
      this.editShow = false;
    },
  },
};
</script>

<style>
</style>