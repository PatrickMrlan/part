<template>
  <myDialog
    :title="title"
    :width="1000"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <el-col :span="6">
      <myTree
        title="所属部门"
        :default-expand-all="true"
        @node-click="nodeClick"
        :onResizeHeight="false"
        :treeList="deptree"
        :key="timeStamp"
        :loading="loading"
        :nowIndex="nowIndex"
      />
    </el-col>
    <el-col :span="18">
      <div class="app-list-control app-row">
        <div class="flex">
          <el-select
            v-model.trim="listQuery.userName"
            filterable
            remote
            class="input-normal"
            placeholder="请输入用户昵称"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable
            @keyup.native.enter="search"
            @change="changeSelect"
            @blur="blurSelect"
          >
            <el-option
              v-for="item in remoteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input
            v-model="listQuery.userName"
            class="input-normal"
            placeholder="姓名"
            clearable
          /> -->
          <myButton
            :type="'search'"
            plain
            icon="el-icon-search"
            @click.native.stop="search"
            >搜索</myButton
          >
        </div>
        <div v-if="multiple" class="right">
            <myButton
              :type="'confirm'"
              icon="el-icon-check"
              @click.native="submitForm('dialogForm')"
              >选择</myButton
            >
          </div>
      </div>
      <myTable
        :showIndex="true"
        :selection="true"
        :checked="checked"
        :loading.sync="loading"
        :tableData="tableData"
        :total.sync="total"
        :onResizeHeight="false"
        :showToolsRight="false"
        :pageIndex="listQuery.pageIndex"
        @change="multiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        :rowKey="rowKey"
        @row-click="handleClickTableRow"
      />
    </el-col>

  </myDialog>
</template>

<script>
import { list, addGroupUser, likeUserNames } from "@/api/user";
import { Message } from "element-ui";
import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "添加用户";
      },
    },
    groupId: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      listQuery: {
        userName: null,
        depId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      deptree: [],
      remoteOptions: [],
      timeStamp: 0,
      nowIndex: null,
      total: 0,
      checked: [
        { key: "用户昵称", val: "userName" },
        { key: "公司", val: "entName" },
        { key: "组织机构", val: "depName" ,align:"center"},
        { key: "联系电话", val: "tel", align: "center" },
      ],
    };
  },
  created() {
    this.listQuery.groupId = this.groupId;
    this.loadData();
  },
  methods: {
    nodeClick(e) {
      console.log(e);
      this.nowIndex = e;
      this.listQuery.depId = this.nowIndex;
      this.listQuery.pageIndex = 1;
      this.loadData();
    },
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      list(that.listQuery)
        .then((res) => {
          that.tableData = res.page.records;
          that.total = res.page.total;
          that.deptree = res.depList;
          that.deptree.unshift({
            id: null,
            title: "全部",
          });
          that.timeStamp = new Date().getTime();
          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    rowKey(row) {
      return row.userId;
    },
    handleClickTableRow(row, event, column) {
      this.$refs.fileTable.toggleRowSelection(row);
    },
    search() {
      this.loadData();
    },
    getRemoteData(query) {
      likeUserNames({
        keyword: query,
      }).then((res) => {
        this.remoteData = res;
        this.remoteList = this.remoteData.map((item) => {
          return { value: `${item}`, label: `${item}` };
        });
        setTimeout(() => {
          this.loading = false;
          this.remoteOptions = this.remoteList;
        }, 200);
      });
    },
    /**
     * 远程搜索方法
     */
    remoteMethod(query) {
      if (query.trim()) {
        console.log(query);
        this.loading = true;
        this.getRemoteData(query);
      } else {
        this.remoteOptions = [];
      }
    },
    changeSelect(val) {
      this.search();
      if (!val) {
        this.remoteData = [];
        this.remoteList = [];
        this.remoteOptions = [];
      }
    },
    blurSelect() {
      setTimeout(() => {
        this.remoteData = [];
        this.remoteList = [];
        this.remoteOptions = [];
      }, 500);
    },
    /**
     * 表格多选回调事件
     */
    multiple(val) {
      this.multipleSelection = val;
    },
    /**
     * 序号
     */
    indexMethod(index) {
      return (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + index + 1;
    },
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.loadData();
    },
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.loadData();
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      var userIds = [];
      console.log(that.multipleSelection);
      that.multipleSelection.forEach((item) => {
        userIds.push(item.userId);
      });
      that.loading = true;
      addGroupUser({
        groupId: that.groupId,
        userIds: userIds,
      })
        .then((res) => {
          that.loading = false;
          Message({
            type: "success",
            message: "操作成功",
          });
          this.$emit("close", { reload: true });
        })
        .catch(() => {
          that.loading = false;
        });
    },
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
.vue-treeselect {
  width: 300px;
  .vue-treeselect__control {
    height: 32px;
    line-height: 32px;
  }
  .vue-treeselect__input {
    height: 32px;
    line-height: 32px;
  }
}
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 18px;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
