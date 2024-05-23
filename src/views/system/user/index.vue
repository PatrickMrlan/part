<template>
  <div id="table-classic-wrapper" class="table-classic-wrapper">
    <el-col :span="6">
      <div class="block mh">
        <div class="title app-row">
          <div class="flex">组织架构</div>
        </div>
        <div class="content">
          <el-tree
            :key="timeStamp"
            :data="depList"
            node-key="id"
            :highlight-current="isHight"
            :default-expanded-keys="defaultShowNodes"
            :default-expand-all="false"
            :current-node-key="nowIndex"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          >
            <span slot-scope="{ data }" class="app-tree-node">
              <span :title="data.name" class="node-text">{{ data.name }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-col>
    <!-- 操作栏 -->
    <el-col :span="18">
      <div ref="appRowHeight" class="app-list-control app-row">
        <div class="flex">
          <el-select
            v-model.trim="listQuery.userName"
            filterable
            remote
            class="input-long"
            placeholder="用户昵称/登录账户/联系电话"
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
            />
          </el-select>
          <el-select
            v-model="listQuery.userType"
            clearable
            placeholder="用户类型"
          >
            <el-option
              v-for="item in userTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
          <!-- <el-button icon="el-icon-circle-close" circle @click="clearAll" /> -->
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
            >删除
          </myButton>
        </div>
      </div>
      <myTable
        ref="fileTable"
        :show-index="true"
        :loading.sync="loading"
        :selection="true"
        :checked="checked"
        :table-data="tableData"
        :d-c-authority="pageOper.DC"
        :total.sync="total"
        :page-index="listQuery.pageIndex"
        custom-label="操作"
        custom1-label="是否禁止使用"
        custom-label-width="180px"
        custom1-label-width="120px"
        :row-key="rowKey"
        @change="multiple"
        @pageSizeChange="pagerSizeChange"
        @pageCurrentChange="pagerCurrentChange"
        @getExportTableData="getExportTableData"
      >
        <template slot="custom1" slot-scope="scope">
          <el-tooltip :content="scope.data.row.isDisableStr" placement="left">
            <el-switch
              v-model="scope.data.row.isDisableStr"
              active-value="禁用"
              inactive-value="正常"
              @change="changeDisable(scope.data.row)"
            />
          </el-tooltip>
        </template>
        <template slot="custom2" slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            circle
            title="权限配置"
            icon="el-icon-s-operation"
            @click="permissionDeploy(scope.data.row)"
          />
        </template>
        <template slot="custom" slot-scope="scope">
          <myHandle>
            
            <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
              编辑
            </span>
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
    <edit
      v-if="editShow"
      :id="editId"
      :title="titleName"
      :ent-dep="entDep"
      @close="editColse"
    />
    <!-- <Permission
      v-if="permissionShow"
      :user-id="userId"
      @close="permissionClose"
    /> -->
  </div>
</template>

<script>
import { list, remove, disable, likeUserNames, enumList } from "@/api/user";
import { treeList } from "@/api/department";
import edit from "./edit";
import Permission from "../userGroup/editAppConfig";
import { Message } from "element-ui";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Table",
  components: { edit },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      defaultProps: {
        children: "children",
        label: "title"
      },
      // 新增/修改 标题
      titleName: null,
      // 数据列表加载动画
      loading: true,
      editShow: false,
      editId: null,
      menuShow: false,
      permissionShow: false,
      userId: null,
      isHight: true,
      userTypeList: [],
      // 筛选列
      checked: [
        { key: "企业名称", val: "entName", width: "190px" },
        { key: "登录账户", val: "account", align: "center" },
        { key: "用户昵称", val: "userName" },
        { key: "所在部门", val: "depName" },
        { key: "联系电话", val: "tel", align: "center", width: "120px" },
        { key: "添加时间", val: "addTime", align: "center", width: "150px" }
      ],
      // 查询列表参数对象
      listQuery: {
        entId: null,
        depId: null,
        userName: null,
        pageIndex: 1,
        pageSize: 10
      },
      depList: [], // 部门数组
      entList: [], // 企业数组
      remoteOptions: [],
      remoteList: [],
      remoteData: [],
      total: 0,
      // 表格数据数组
      tableData: [],
      deptree: [],
      // 多选数据暂存数组
      multipleSelection: [],
      timeStamp: 0,
      nowIndex: null,
      entId: null,
      defaultShowNodes: [],
      entDep: null,
      seesionLoginUser: JSON.parse(sessionStorage.getItem("loginUser") || "{}")
    };
  },
  mounted() {
    this.getEnumList();
    this.getTreeList();
  },
  created() {
    if (this.multiple) {
      this.customLabel = null;
    }
  },

  methods: {
    getEnumList() {
      const that = this;
      that.loading = true;
      enumList()
        .then(res => {
          that.loading = false;
          that.userTypeList = res.userTypeList;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    rowKey(row) {
      return row.userId;
    },

    /**
     * 是否禁用
     */
    changeDisable(data) {
      console.log(data);
      const that = this;
      that.loading = true;
      disable(data.userId)
        .then(res => {
          Message({
            type: "success",
            message: "操作成功"
          });
          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },

    /**
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      // console.log(node);
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      };
    },
    /**
     * 授权
     */
    permissionDeploy(data) {
      console.log(data);
      this.permissionShow = true;
      this.userId = data.userId;
    },
    permissionClose() {
      this.permissionShow = false;
    },
    /**
     * 把选择展示数据的名称存入key
     */
    handleCheck(event) {
      this.key = [];
      this.checked.forEach(item => {
        event.forEach(val => {
          if (item.key === val) {
            this.key.push(item);
          }
        });
      });
    },
    // 点击tree树的子节点
    nodeClick: function(data) {
      this.isHight = true;
      if (data.isEnt) {
        this.listQuery.entId = data.id;
        this.listQuery.depId = null;
      } else {
        this.listQuery.depId = data.id;
        this.listQuery.entId = null;
      }
      this.entDep = data;
      this.search();
    },
    clickAll() {
      this.isHight = false;
      this.listQuery.departmentId = null;
      this.getMainData();
      this.search();
    },

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e;
    },
    // 清除所有搜索条件
    clearAll() {
      this.listQuery.entId = null;
      this.listQuery.depId = null;
      this.listQuery.userName = null;
      this.search();
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
        keyword: query
      }).then(res => {
        this.remoteData = res;
        this.remoteList = this.remoteData.map(item => {
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
        this.listQuery.userName = query;
        this.getRemoteData(query);
      } else {
        this.remoteOptions = [];
      }
    },
    changeSelect(val) {
      this.search();
      // if (!val) {
      //   this.remoteData = [];
      //   this.remoteList = [];
      //   this.remoteOptions = [];
      // }
    },
    blurSelect() {
      setTimeout(() => {
        this.remoteData = [];
        this.remoteList = [];
        this.remoteOptions = [];
      }, 500);
    },

    getTreeList() {
      const entId = this.seesionLoginUser.entId;
      treeList({ entId: entId }).then(res => {
        console.log(res);
        this.depList = res;
        this.timeStamp = new Date().getTime();
        // this.depList.forEach((item) => {
        //   this.defaultShowNodes.push(item.id);
        // });
        this.nowIndex = this.depList[0].id;
        this.listQuery.entId = this.nowIndex;
        console.log(this.nowIndex);
        this.depList.unshift({
          id: null,
          name: "全部"
        });
        this.getMainData();
      });
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      this.loading = true;
      list(that.listQuery)
        .then(res => {
          console.log(res);
          that.loading = false;

          that.entList.forEach(item => {
            if (item.isSelect === "1") {
              that.entId = item.id;
            }
          });
          that.tableData = res.page.records;
          that.total = res.page.total;
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
        .then(res => {
          that.$refs.fileTable.exportTable(res.page.records);
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
        this.getMainData();
      }
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      // data 为 null 时添加
      console.log(data);
      if (data == null) {
        this.editId = null;
        this.titleName = "新增用户";
      } else {
        this.editId = data.userId;
        this.titleName = "修改用户";
      }
      this.editShow = true;
    },
    /**
     * 删除/批量删除事件
     */
    remove(data) {
      console.log(data);
      const that = this;
      let deleteData = [];

      if (data == null) {
        that.multipleSelection.forEach(item => {
          deleteData.push(item.userId);
        });
      } else {
        deleteData = [data.userId];
        console.log(deleteData);
      }

      if (deleteData.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!"
        });
        return;
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;

          remove(deleteData)
            .then(res => {
              Message({
                type: "success",
                message: "操作成功"
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
    }
  }
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}

/deep/.vue-treeselect__control {
  height: 30px !important;
  box-sizing: border-box;

  .vue-treeselect__value-container {
    height: 30px !important;

    .treeselect__placeholder {
      height: 30px !important;
    }

    .vue-treeselect__input-container {
      height: 30px !important;
    }

    .vue-treeselect__input {
      height: 30px !important;
    }
  }
}
.mh {
  height: calc(100vh - 170px);
  min-height: calc(100vh - 175px);
  overflow: auto;
}
</style>
