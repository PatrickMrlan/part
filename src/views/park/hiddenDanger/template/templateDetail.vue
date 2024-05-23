<template>
  <myDialog
    :title="title"
    width="85%"
    class="dialog-form"
    :visible="true"
    :loading="loading"
    :cancel="cancel"
  >
    <el-col>
      <!-- 操作栏 -->
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model.trim="listQuery.keyword"
            class="input-long"
            clearable
            placeholder="检查内容"
            @keyup.native.enter="search"
          />
          <myButton icon="el-icon-search" @click.native="search">搜索</myButton>
        </div>
        <div class="right">
          <myButton icon="el-icon-plus" @click.native="add">新增</myButton>
          <myButton
            icon="el-icon-delete"
            type="remove"
            @click.native="remove(null)"
            >删除</myButton
          >
        </div>
      </div>

      <myTable
        ref="fileTable"
        :show-index="true"
        :selection="true"
        :on-resize-height="false"
        :d-c-authority="true"
        :checked="checked"
        :loading.sync="loading"
        :table-data="tableData"
        :total.sync="total"
        :page-index="listQuery.pageIndex"
        custom-label="操作"
        custom-label-width="80px"
        :row-key="rowKey"
        @change="handleMultiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span title="删除" @click="remove(scope.data.row)"> 删除 </span>
          </myHandle>
        </template>
      </myTable>
    </el-col>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
    </template>

    <standardLookup
      v-if="standardLookupShow"
      title="从隐患标准中选择"
      :id="listQuery.templateId"
      :tags="tableData"
      @close="standardLookupClose"
    />
  </myDialog>
</template>

<script>
import {
  listByTemplate as list,
  deleteStandardByTemplate as remove,
} from "@/api/hazard/standard";
import standardLookup from "./standardLookup.vue";

export default {
  components: { standardLookup },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      listQuery: {
        templateId: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },

      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: null,

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
      standardLookupShow: false,
    };
  },
  created() {
    this.listQuery.templateId = this.id;
    this.getMainData();
  },

  methods: {
    add() {
      this.standardLookupShow = true;
    },

    standardLookupClose(data) {
      if (data.reload) {
        this.getMainData();
      }
      this.standardLookupShow = false;
    },
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },

    rowKey(row) {
      return row.id;
    },

    handleMultiple(e) {
      this.multipleSelection = [];
      if (e && e.length) {
        e.forEach((item) => {
          this.multipleSelection.push(item.standardId);
        });
      }
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
          remove({
            objectId: this.listQuery.templateId,
            objectIdList: deleteData,
          })
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

    cancel(done) {
      this.$emit("close", {});
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
  },
};
</script>

<style lang="less" scoped>
</style>