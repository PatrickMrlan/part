<template>
  <myDialog
    :title="title"
    width="1000px"
    class="dialog-form"
    :cancel="cancel"
    :visible="true"
    :top="'10vh'"
  >
    <div class="table-classic-wrapper">
      <!-- 操作栏 -->
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.keyword"
            placeholder="关键字查询"
            clearable
            class="input-short"
            @keyup.native.enter="search"
          />
          <!-- <el-input
                v-model="listQuery.userName"
                class="input-normal"
                clearable
                placeholder="用户昵称"
                @keyup.native.enter="search"
              /> -->
          <myButton icon="el-icon-search" @click.native="search">搜索</myButton>
        </div>
        <div class="right">
          <myButton
            :type="'confirm'"
            icon="el-icon-plus"
            @click.native="add(null)"
            >添加</myButton
          >
          <myButton
            :type="'remove'"
            icon="el-icon-delete"
            @click.native="deleteUser(null)"
            >删除</myButton
          >
        </div>
      </div>
      <myTable
        ref="fileTable"
        :on-resize-height="false"
        :checked="checked"
        :show-index="true"
        :selection="true"
        :loading.sync="loading"
        :table-data="tableData"
        :total.sync="total"
        :show-tools-right="false"
        :page-index="listQuery.pageIndex"
        :row-key="rowKey"
        @change="handleMultiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
      />
    </div>
    <lookupEnt
      v-if="lookupEntShow"
      :multiple="true"
      :show="lookupEntShow"
      :is-task="isTask"
      :task-id="taskId"
      @close="lookupEntClose"
    />
  </myDialog>
</template>

<script>
import { entListByTaskId, deleteEnt, addEnt } from "@/api/hazard/task";
import lookupEnt from "./lookupEnt.vue";
import { Message } from "element-ui";

export default {
  name: "Table",
  components: { lookupEnt },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "受检企业";
      },
    },
    taskId: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
    detailId: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
    isTask: {
      type: Number,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      // 数据列表加载动画
      loading: true,
      lookupEntShow: false,
      // 查询列表参数对象
      listQuery: {
        userName: null, // 用户名称
        pageIndex: 1,
        pageSize: 10,
      },
      remoteOptions: [],
      total: 0,
      timeStamp: 0,
      nowIndex: null,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      checked: [
        { key: "企业名称", val: "entName", align: "center", width: "200px" },
        { key: "联系人", val: "contact", align: "center", width: "120px" },
        { key: "联系电话", val: "contactTel", align: "center" },
        { key: "企业地址", val: "address", align: "center" },
        {
          key: "统一信用代码",
          val: "entCode",
          align: "center",
          width: "200px",
        },
        { key: "企业状态", val: "entState", align: "center", width: "100px" },
      ],
      isHight: false,
      defaultShowNodes: [],
    };
  },
  created() {
    this.getMainData();
  },
  mounted() {},
  methods: {
    add() {
      this.lookupEntShow = true;
    },
    lookupEntClose(data) {
      var that = this;
      if (data.length > 0) {
        var objectId = this.isTask ? this.taskId : this.detailId;
        var objectType = this.isTask;
        var objectIdList = data.map((item) => {
          return item.entId;
        });
        var dataObject = {
          objectId: objectId,
          objectType: objectType,
          objectIdList: objectIdList,
        };
        console.log(dataObject);
        addEnt(dataObject)
          .then((res) => {
            that.loading = false;

            that.search();
          })
          .catch(() => {
            that.loading = false;
          });
      }
      this.lookupEntShow = false;
      this.search();
    },
    rowKey(row) {
      return row.entId;
    },

    handleMultiple(e) {
      this.multipleSelection = e;
    },

    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      entListByTaskId({
        taskId: that.taskId,
        detailId: that.detailId,
        keyword: that.listQuery.keyword,
        pageIndex: that.listQuery.pageIndex,
        pageSize: that.listQuery.pageSize,
        isTask: 0,
      })
        .then((res) => {
          that.loading = false;
          that.timeStamp = new Date().getTime();

          that.tableData = res.records;

          that.total = res.total;
        })
        .catch(() => {
          that.loading = false;
        });
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
    cancel(done) {
      this.$emit("close", this.multipleSelection, false);
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
    /**
     * 删除/批量删除事件
     */
    deleteUser() {
      console.log();
      const that = this;

      var objectId = this.isTask ? this.taskId : this.detailId;
      var objectType = this.isTask;
      var objectIdList = that.multipleSelection.map((item) => {
        return item.entId;
      });
      var dataObject = {
        objectId: objectId,
        objectType: objectType,
        objectIdList: objectIdList,
      };
      if (objectIdList.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      }
      this.$confirm(
        "确认删除选中的" + objectIdList.length + "条数据?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;

          deleteEnt(dataObject)
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
.flex {
  display: flex;
  align-items: center;
}

.table-classic-wrapper {
  overflow: hidden;
}
.treeList {
  min-height: calc(100vh - 340px);
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  margin-right: 10px;
  padding: 10px 0;
}
</style>

