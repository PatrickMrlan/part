<template>
  <myDialog
    ref="dialogHeight"
    :title="title"
    width="1000px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <div class="table-classic-wrapper">
      <el-col v-if="title == '选择用户'" :span="6">
        <myTree
          title="所属部门"
          :default-expand-all="true"
          @node-click="nodeClick"
          :onResizeHeight="false"
          :treeList="deptree"
          :key="timeStamp"
          :nowIndex="nowIndex"
        />
      </el-col>
      <el-col :span="title == '选择用户' ? 18 : 24">
        <!-- 操作栏 -->
        <div class="app-list-control app-row" ref="appRowHeight">
          <div class="flex">
            <el-select
              v-if="title == '选择用户'"
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
              v-if="title == '选择用户'"
              v-model="listQuery.userName"
              class="input-normal"
              placeholder="姓名"
              clearable
            /> -->
            <el-input
              v-if="title == '选择企业'"
              v-model="listQuery.conditions"
              class="input-normal"
              placeholder="企业名称"
              clearable
            />
            <el-input
              v-if="title == '选择用户分组'"
              v-model="listQuery.groupName"
              class="input-normal"
              placeholder="分组名称"
              clearable
            />
            <myButton
              :type="'search'"
              v-if="title != '选择部门'"
              plain
              icon="el-icon-search"
              @click.native.stop="search"
              >搜索</myButton
            >
          </div>
          <div v-if="multiple" class="right">
            <myButton
              :type="'confirm'"
              icon="el-icon-refresh"
              @click.native="reset"
              >重置</myButton
            >
            <myButton
              :type="'confirm'"
              icon="el-icon-check"
              @click.native="check(null)"
              >选择</myButton
            >
          </div>
        </div>
        <myTable
          ref="fileTable"
          :showIndex="multiple"
          :selection="multiple"
          :checked="checked"
          :loading.sync="loading"
          :tableData="tableData"
          :total.sync="total"
          :pageIndex="listQuery.pageIndex"
          :showToolsRight="false"
          :customLabel="customLabel"
          customLabelWidth="60px"
          @change="handleMultiple"
          @pageSizeChange="pagerSizeChange"
          @pageCurrentChange="pagerCurrentChange"
          :onResizeHeight="false"
          :row-key="rowKey"
          @row-click="handleClickTableRow"
          @selection-change="handleSelectionChange"
        >
          <template slot="custom" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              circle
              icon="el-icon-check"
              @click="check(scope.data.$index)"
            />
          </template>
        </myTable>
      </el-col>
    </div>
  </myDialog>
</template>
  
  <script>
import { userList, depList, enterpriseList, groupList } from "@/api/selectList";
import { likeUserNames } from "@/api/user";

export default {
  name: "Table",
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    tags: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 数据列表加载动画
      loading: true,
      // 查询列表参数对象
      listQuery: {
        userName: null,
        depId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      remoteOptions: [],
      // 多选数据暂存数组
      multipleSelection: [],
      customLabel: "操作",
      checked: [
        { key: "姓名", val: "userName", align: "center", sortable: true },
        { key: "账号", val: "account", align: "center", sortable: true },
        { key: "联系电话", val: "tel", align: "center", sortable: true },
      ],
      deptree: [],
      timeStamp: 0,
      nowIndex: null,
    };
  },
  created() {
    if (this.multiple) {
      this.customLabel = null;
    }
  },
  mounted() {
    this.getMainData();
    if (this.tags.length) {
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          console.log(item);
          if (this.title == "选择用户") {
            item.userId = item.showId;
          } else if (this.title == "选择部门") {
            item.id = item.showId;
          } else if (this.title == "选择企业") {
            item.entId = item.showId;
          } else if (this.title == "选择用户分组") {
            item.id = item.showId;
          }
          this.$refs.fileTable.$refs.multipleTable.toggleRowSelection(item);
        });
      });
    }
  },

  methods: {
    rowKey(row) {
      if (this.title == "选择用户") {
        return row.userId;
      } else if (this.title == "选择部门") {
        return row.id;
      } else if (this.title == "选择企业") {
        return row.entId;
      } else if (this.title == "选择用户分组") {
        return row.id;
      }
    },
    handleClickTableRow(row, event, column) {
      this.$refs.fileTable.toggleRowSelection(row);
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
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
    nodeClick(e) {
      console.log(e);
      this.nowIndex = e;
      this.listQuery.depId = this.nowIndex;
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      switch (that.title) {
        case "选择用户":
          userList(that.listQuery)
            .then((res) => {
              that.loading = false;
              console.log(res);
              that.tableData = res.page.records;
              that.deptree = res.depList;
              that.deptree.unshift({
                id: null,
                title: "全部",
              });
              that.timeStamp = new Date().getTime();
              that.listQuery.pageSize = res.page.size;
              that.listQuery.pageIndex = res.page.current;
              that.total = res.page.total;
            })
            .catch(() => {
              that.loading = false;
            });
          break;
        case "选择部门":
          that.checked = [
            {
              key: "部门名称",
              val: "name",
              align: "center",
              sortable: true,
            },
          ];
          depList(that.listQuery)
            .then((res) => {
              that.loading = false;
              console.log(res);
              that.tableData = res;
              that.total = res.length;
            })
            .catch(() => {
              that.loading = false;
            });
          break;
        case "选择企业":
          that.checked = [
            {
              key: "企业全称",
              val: "entFullName",
              align: "center",
              sortable: true,
            },
            {
              key: "企业简称",
              val: "entShortName",
              align: "center",
              sortable: true,
            },
            { key: "地址", val: "address", align: "center", sortable: true },
          ];
          enterpriseList(that.listQuery)
            .then((res) => {
              that.loading = false;
              console.log(res);
              that.tableData = res.records;
              that.listQuery.pageSize = res.size;
              that.listQuery.pageIndex = res.current;
              that.total = res.total;
            })
            .catch(() => {
              that.loading = false;
            });
          break;
        case "选择用户分组":
          that.checked = [
            {
              key: "分组名称",
              val: "groupName",
              align: "center",
              sortable: true,
            },
            {
              key: "添加时间",
              val: "addTime",
              align: "center",
              sortable: true,
            },
          ];
          groupList(that.listQuery)
            .then((res) => {
              that.loading = false;
              console.log(res);
              that.tableData = res;
              that.total = res.length;
            })
            .catch(() => {
              that.loading = false;
            });
          break;
      }
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
      console.log(this.multipleSelection);
      this.listQuery.pageIndex = pageIndex;
      this.getMainData();
    },
    cancel(done) {
      this.$emit("close", this.multipleSelection, false);
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
    check(index) {
      if (index != null && index >= 0) {
        this.multipleSelection = [];
        this.multipleSelection.push(this.tableData[index]);
      }
      this.$emit("close", this.multipleSelection, true);
    },
    // 重置
    reset() {
      // 清空所有选中的行
      this.$refs.fileTable.$refs.multipleTable.clearSelection();
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
  },
};
</script>
  
  <style lang="less" scoped></style>
  