<template>
  <div class="table-classic-wrapper">
    <el-col :span="6">
      <myTree
        :key="timeStamp"
        title="系统配置分类"
        :default-expand-all="true"
        :tree-list="classifyTree"
        :loading="loading"
        :now-index="nowIndex"
        @node-click="nodeClick"
      >
        <template slot="title">
          <i
            v-if="pageOper.TJ"
            title="添加配置"
            class="el-icon-plus"
            @click="configureEdit('add', null)"
          />
        </template>
        <template slot="item" slot-scope="scope">
          <i
            v-if="!scope.data.pid"
            class="el-icon-circle-plus-outline"
            title="添加配置"
            @click="configureEdit('add', scope.data)"
            >&nbsp;</i
          >
          <i
            class="el-icon-edit-outline"
            title="编辑配置"
            @click="configureEdit('edit', scope.data)"
            >&nbsp;</i
          >
          <i
            class="el-icon-delete"
            title="删除配置"
            @click="configureRemove(scope.data)"
          />
        </template>
      </myTree>
    </el-col>
    <el-col :span="18">
      <!-- 操作栏 -->
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.keyword"
            placeholder="配置编码"
            clearable
            class="input-long"
            @keyup.native.enter="search"
          />
          <myButton
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
        :rowKey="rowKey"
        :show-index="true"
        :selection="true"
        :checked="checked"
        :loading.sync="loading"
        :table-data.sync="configureList"
        :d-c-authority="pageOper.DC"
        :total.sync="total"
        :page-index="listQuery.pageIndex"
        export-file-name="系统配置"
        custom-label="操作"
        custom-label-width="120px"
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
    <configureEdit
      v-if="configureEditShow"
      :id="configureEditId"
      :pid="configureEditPid"
      :title="titleName"
      @close="configureEditColse"
    />
    <edit
      v-if="editShow"
      :id="editId"
      :configure-type-id="listQuery.configureTypeId"
      :title="titleName"
      @close="editColse"
    />
  </div>
</template>

<script>
import {
  list,
  remove,
  treeList,
  treeRemove,
} from "@/api/system/theSystemConfiguration";
import edit from "./edit";
import configureEdit from "./configureEdit";
import { Message } from "element-ui";

export default {
  name: "Table",
  components: { configureEdit, edit },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      editShow: false,
      editId: null,
      // 筛选列
      checked: [
        { key: "配置编码", val: "configureKey" },
        { key: "配置值", val: "configureValue" },
        { key: "配置详情", val: "configureDetail" },
        { key: "是否系统", val: "isSystem", align: "center", width: "100px" },
      ],
      listQuery: {
        configureTypeId: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },
      configureEditShow: false,
      titleName: null,
      classifyTree: [],
      configureEditId: null,
      configureEditPId: null,
      configureList: [],
      total: 0,
      screenHeight: null,
      multipleSelection: [],
      timeStamp: 0,
      nowIndex: null,
    };
  },
  async mounted() {
    await this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    editGroup() {},
    /**
     * 搜索
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.configureList = [];
      this.getConfigureList();
    },
    getMainData() {
      this.loading = true;
      treeList()
        .then((res) => {
          this.loading = false;
          this.classifyTree = res;
          this.timeStamp = new Date().getTime();
          // 默认加载第一个类型的数据
          this.getConfigureList(res[0].id);
          this.nowIndex = res[0].id;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getConfigureList(data) {
      const that = this;
      if (data) {
        that.listQuery.configureTypeId = data;
      }
      that.configureList = [];
      that.loading = true;
      list(that.listQuery)
        .then((res) => {
          console.log(res);
          that.loading = false;
          that.configureList = res.records;
          that.total = res.total;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    nodeClick(data) {
      this.listQuery.pageSize = 10;
      this.listQuery.pageIndex = 1;
      this.getConfigureList(data);
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
     * 关闭编辑页面
     */
    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getConfigureList();
      }
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data == null) {
        this.editId = null;
        this.titleName = "新增配置";
      } else {
        this.editId = data.id;
        this.titleName = "修改配置";
      }
      this.editShow = true;
    },
    configureEditColse(data) {
      this.configureEditShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    configureEdit(type, data) {
      // 新增
      console.log(type, data);
      if (type === "add") {
        this.configureEditId = null;
        if (data) {
          this.configureEditPid = data.id;
        } else {
          this.configureEditPid = null;
        }
        this.titleName = "新增系统配置";
      } else {
        this.configureEditPid = data.id;
        this.configureEditId = data.id;
        this.titleName = "修改系统配置";
      }
      this.configureEditShow = true;
    },
    configureRemove(data) {
      console.log(data);
      const that = this;
      let deleteData = [];

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push({ id: item.id, value: item.title });
        });
      } else {
        deleteData = { id: data.id, value: data.title };
        console.log(deleteData);
      }

      if (deleteData.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      }
      this.$confirm("确认删除选中的这条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          treeRemove(deleteData)
            .then((res) => {
              that.loading = false;
              Message({
                type: "success",
                message: "操作成功",
              });
              that.getMainData();
            })
            .catch(() => {
              that.loading = false;
            });
        })
        .catch(() => {
          // 取消删除
        });
    },

    // 列表删除
    remove(data) {
      console.log(data);
      const that = this;
      let deleteData = [];

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push({ id: item.id, value: item.configureValue });
        });
      } else {
        deleteData = [{ id: data.id, value: data.configureValue }];
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
.app-bottomBtn {
  display: flex;
  margin-top: 10px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.icon {
  display: none;
  i {
    font-size: 16px;
  }
}
.show-hide:hover .icon {
  display: block;
}

/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #409eff !important;
}
</style>
