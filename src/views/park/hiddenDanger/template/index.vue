<template>
  <div class="table-classic-wrapper">
    <el-col :span="6">
      <div class="block">
        <div class="title app-row">
          <div class="flex">隐患排查模板分类</div>
          <div class="unflex">
            <i
              v-if="pageOper.TJ"
              class="el-icon-plus"
              @click="editClassification(null, 'add')"
            />
          </div>
        </div>
        <div class="content">
          <el-tree
            :key="timeStamp"
            :data="treeList"
            v-loading="treeLoading"
            node-key="id"
            highlight-current
            :default-expand-all="false"
            :expand-on-click-node="false"
            :current-node-key="nowIndex"
            @node-click="nodeClick"
          >
            <span
              slot-scope="{ data }"
              class="app-tree-node"
              @mouseenter="mouseenter(data)"
              @mouseleave="mouseleave(data)"
            >
              <span :title="data.name" class="node-text">{{ data.name }}</span>
              <span v-show="data.isTreeSelect">
                <i
                  class="el-icon-plus"
                  @click="editClassification(data, 'add')"
                >
                </i>
                <i
                  class="el-icon-edit"
                  @click="editClassification(data, 'edit')"
                >
                </i>
                <i class="el-icon-delete" @click="removeClassification(data)">
                </i>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.keyword"
            placeholder="模板名称"
            clearable
            class="input-long"
            @keyup.native.enter="search"
          />
          <myButton type="search" icon="el-icon-search" @click.native="search"
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
        :rowKey="rowKey"
        :show-index="true"
        :selection="true"
        :checked="checked"
        :loading.sync="loading"
        :table-data.sync="tableData"
        :d-c-authority="pageOper.DC"
        :total.sync="total"
        :page-index="listQuery.pageIndex"
        custom-label="操作"
        custom-label-width="180px"
        @change="multiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        @getExportTableData="getExportTableData"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span
              v-if="pageOper.XG"
              title="查看明细"
              @click="viewDetail(scope.data.row)"
            >
              查看明细
            </span>
            <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
              编辑
            </span>
            <span
              v-if="pageOper.SC && scope.data.row.isSystem != '是'"
              title="删除"
              @click="remove(scope.data.row)"
            >
              删除
            </span>
          </myHandle>
        </template>
      </myTable>
    </el-col>

    <editClassification
      v-if="editClassificationShow"
      :title="titleName"
      :id="editId"
      :type="editType"
      @close="editClose"
    />

    <edit
      v-if="editShow"
      :visible="editShow"
      :id="editId"
      :categoryId="listQuery.categoryId"
      :type="type"
      :title="titleName"
      @close="editClose"
    />

    <templateDetail
      v-if="templateDetailShow"
      :title="titleName"
      :id="editId"
      @close="editClose"
    />
  </div>
</template>

<script>
import {
  remove,
  enumList,
  list,
  removeCategory,
  listCategory,
} from "@/api/hazard/template";

import editClassification from "./editClassification.vue";
import edit from "./edit.vue";
import templateDetail from "./templateDetail.vue";

export default {
  components: { editClassification, edit, templateDetail },
  props: {
    type: {
      required: false,
      default() {
        return null;
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
      treeLoading: false,
      timeStamp: 0,
      editClassificationShow: false,
      templateDetailShow: false,
      editShow: false,
      editType: null,
      titleName: null,
      editId: null,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      multipleSelection: [],
      checked: [
        { key: "模板名称", val: "templateName" },
        { key: "所属模板分类", val: "categoryName" },
        { key: "模板类型", val: "templateType", align: "center", width: 120 },
        { key: "备注", val: "remark" },
      ],
      treeList: [],
      enumList: {},
      nowIndex: null,
    };
  },
  created() {
    this.getTree();
    this.getEnumList();
  },
  methods: {
    /**
     * 查看明细
     */
    viewDetail(data) {
      console.log(data);
      if (data) {
        this.editId = data.templateId;
      } else {
        this.editId = null;
      }
      this.titleName = "查看模板明细";
      this.templateDetailShow = true;
    },

    /**
     * 树形数据
     */
    getTree() {
      this.treeLoading = true;
      listCategory()
        .then((res) => {
          this.treeList = res;
          if (this.treeList.length) {
            this.nowIndex = this.treeList[0].id;
            this.listQuery.categoryId = this.nowIndex;
          }
          this.timeStamp = new Date().getTime();
          this.getMainData();
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },

    getEnumList() {
      enumList().then((res) => {
        this.enumList = res;
      });
    },

    nodeClick(data) {
      this.listQuery.categoryId = data.id;
      this.getMainData();
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
      return row.templateId;
    },
    mouseenter(data) {
      data.isTreeSelect = true;
    },
    mouseleave(data) {
      data.isTreeSelect = false;
    },

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = [];
      if (e && e.length) {
        e.forEach((item) => {
          this.multipleSelection.push(item.templateId);
        });
      }
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getConfigureList();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getConfigureList();
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
     * 删除树
     */
    removeClassification(data) {
      const that = this;
      let deleteData = [data.id];

      this.$confirm("确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.treeLoading = true;
          removeCategory(deleteData)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.getTree();
            })
            .finally(() => {
              that.treeLoading = false;
            });
        })
        .catch(() => {
          // 取消删除
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
        deleteData = [data.templateId];
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

    editClassification(data, type) {
      if (data) {
        if (type == "add") {
          this.titleName = "添加分类";
        } else if (type == "edit") {
          this.titleName = "编辑分类";
        }
        this.editId = data.id;
        this.editType = type;
      } else {
        this.titleName = "添加分类";
        this.editId = null;
        this.editType = null;
      }
      this.editClassificationShow = true;
    },

    edit(data) {
      if (data) {
        this.titleName = "编辑模板";
        this.editId = data.templateId;
      } else {
        this.titleName = "添加模板";
        this.editId = null;
      }
      this.editShow = true;
    },

    /**
     * 关闭编辑页面
     */
    editClose(data) {
      if (data.reload) {
        if (data.type == "table") this.getMainData();
        if (data.type == "tree") this.getTree();
      }
      this.editClassificationShow = false;
      this.templateDetailShow = false;
      this.editShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.block {
  height: calc(100vh - 170px);
  min-height: calc(100vh - 175px);
  overflow: auto;
}

.app-tree-node {
  display: flex;
  align-items: center;
  padding-right: 8px;
  width: 100%;
  i {
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}
/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: rgb(0, 110, 255) !important;
  i:hover {
    color: #fff;
  }
}
</style>
