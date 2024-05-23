<template>
  <div class="table-classic-wrapper">
    <el-col :span="6">
      <myTree
        title="用户分组"
        :default-expand-all="true"
        @node-click="nodeClick"
        :treeList="userGroup"
        label="groupName"
        :key="timeStamp"
        :nowIndex="currentIndex"
        :loading="loading"
      >
        <template slot="title">
          <i
            v-if="pageOper.TJ"
            title="添加分组"
            class="el-icon-plus"
            @click="editGroup(null)"
          />
        </template>
        <template slot="item" slot-scope="scope">
          <i
            v-if="pageOper.XG"
            class="el-icon-edit-outline"
            title="修改分组"
            @click.stop="editGroup(scope.data)"
            >&nbsp;</i
          >
          <i
            v-if="pageOper.SC"
            class="el-icon-delete"
            title="删除分组"
            @click.stop="deleteGroup(scope.data)"
            >&nbsp;</i
          >
          <i
            v-if="pageOper.XG"
            class="el-icon-paperclip"
            title="操作权限配置"
            @click.stop="editAppConfig(scope.data)"
            >&nbsp;</i
          >
        </template>
      </myTree>
    </el-col>
    <el-col :span="18">
      <!-- 操作栏 -->
      <div class="app-list-control app-row" ref="appRowHeight">
        <div class="flex">
          <el-input
            v-model="listQuery.name"
            class="input-long"
            clearable
            placeholder="姓名"
            @keyup.native.enter="search"
          />
          <myButton
            v-if="pageOper.CX"
            :type="'search'"
            icon="el-icon-search"
            @click.native.stop="search"
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
        :DCAuthority="pageOper.DC"
        :tableData="tableData"
        :total.sync="total"
        :pageIndex="listQuery.pageIndex"
        customLabel="操作"
        customLabelWidth="100px"
        exportFileName="用户分组管理"
        @change="multiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        :rowKey="rowKey"
      >
        <template slot="custom" slot-scope="scope">
          <myHandle>
            <span
              v-if="pageOper.SC"
              title="删除"
              @click="remove(scope.data.row)"
            >
              删除
            </span>
          </myHandle>
        </template>
      </myTable>
    </el-col>
    <editGroup
      v-if="editGroupShow"
      :id="groupId"
      :title="editGroupTitle"
      @close="closeEdirGroup"
    />
    <editAppConfig
      v-if="editAppConfigShow"
      :groupId="groupId"
      @close="closeEditAppConfig"
    />
    <edit v-if="addShow" :groupId="groupId" @close="closeAddUser" />
  </div>
</template>

<script>
import {
  groupList,
  removeGroup,
  groupUserList,
  deleteGroupUser,
  addGroupUser,
} from "@/api/user";
import edit from "./addUser";
import editGroup from "./editGroup";
import editAppConfig from "./editAppConfig";
import { Message } from "element-ui";

export default {
  name: "Table",
  components: { editGroup, editAppConfig, edit },
  props: {
    depid: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      // 新增/修改 标题
      titleName: null,
      // 数据列表加载动画
      loading: false,
      userGroup: [],
      currentIndex: 0,
      editGroupShow: false,
      groupId: null,
      editGroupTitle: "新增分组",
      editAppConfigShow: false,
      addShow: false,
      editId: null,
      empowerShow: false,
      empowerId: null,
      // 筛选列
      checked: [
        { key: "姓名", val: "userName" },
        { key: "账号", val: "account" },
        { key: "联系电话", val: "tel", align: "center" },
        { key: "添加时间", val: "addTime", align: "center" },
      ],
      // 查询列表参数对象
      listQuery: {
        groupId: null,
        name: null,
        pageIndex: 1,
        pageSize: 10,
      },
      deptree: null,
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      screenHeight: null,
      timeStamp: 0,
    };
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    multiple(e) {
      this.multipleSelection = e;
    },
    nodeClick(e) {
      this.currentIndex = e;
      this.listQuery.groupId = e;
      this.listQuery.pageIndex = 1;
      this.getUserList();
    },
    closeEditAppConfig() {
      this.editAppConfigShow = false;
    },
    getGroupList() {
      groupList().then((res) => {
        res.sort((a, b) => a.sort - b.sort);
        this.userGroup = JSON.parse(JSON.stringify(res));
        this.currentIndex = res[0].id;
        this.listQuery.groupId = res[0].id;
        this.timeStamp = new Date().getTime();
        if (this.userGroup.length > 0) {
          this.getUserList();
        }
      });
    },
    editGroup(data) {
      this.editGroupShow = true;
      if (data) {
        this.groupId = data.id;
        this.editGroupTitle = "编辑分组";
      } else {
        this.groupId = null;
        this.editGroupTitle = "新增分组";
      }
    },
    editAppConfig(data) {
      this.editAppConfigShow = true;
      this.groupId = data.id;
    },
    deleteGroup(data) {
      var that = this;
      if (that.isLoading) {
        return;
      }
      that.isLoading = true;
      this.$confirm("确认删除" + data.groupName + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeGroup([data.id]).then((res) => {
            that.isLoading = false;
            Message({
              type: "success",
              message: "操作成功",
            });
            that.getGroupList();
          });
        })
        .catch(() => {
          // 取消删除
        });
    },
    closeEdirGroup(data) {
      this.editGroupShow = false;
      if (data.reload) {
        this.getGroupList();
      }
    },
    getUserList() {
      this.loading = true;
      groupUserList(this.listQuery)
        .then((res) => {
          this.tableData = res.records;
          this.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    edit() {
      this.addShow = true;
      this.groupId = this.currentIndex;
    },
    closeAddUser(data) {
      this.addShow = false;
      if (data.reload) {
        this.getUserList();
      }
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getUserList();
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getUserList();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getUserList();
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
      var ids = [];

      if (deleteData.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      } else {
        deleteData.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          deleteGroupUser(ids)
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
#table-classic-wrapper {
  display: flex;
  justify-content: space-between;
  .list {
    padding: 0 4px 0 14px;
    line-height: 30px;
    height: 30px;
    box-sizing: border-box;
    display: flex;
    white-space: nowrap;
    justify-content: space-between;
    .deviceTypeSpan {
      width: 60%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .iconWrapper {
      display: flex;
      align-items: center;
    }
    .icon {
      font-size: 16px;
      margin-left: 20px;
    }
    cursor: pointer;
  }
}
</style>
