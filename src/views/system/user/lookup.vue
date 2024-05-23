<template>
  <el-dialog
    :title="title"
    width="1000px"
    class="dialog-form"
    :visible="show"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :destroy-on-close="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    append-to-body
    top="10vh"
  >
    <div class="table-classic-wrapper">
      <!-- 操作栏 -->
      <div class="app-list-control app-row">
        <div class="flex">
          <el-input
            v-model="listQuery.userName"
            class="input-normal"
            placeholder="姓名/账号/电话号码"
          />
          <treeselect
            v-model="listQuery.depId"
            :multiple="false"
            :close-on-select="true"
            :options="deptree"
            :normalizer="treeSelectNormalizer"
            no-results-text="未找到相关结果"
            no-options-text="没有可选择的数据"
            placeholder="组织架构"
          />
          <el-button type="primary" plain icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </div>
        <div v-if="multiple" class="right">
          <el-button type="danger" icon="el-icon-check" @click="reset()"
            >重置</el-button
          >
          <el-button type="primary" icon="el-icon-check" @click="check(null)"
            >选择</el-button
          >
        </div>
      </div>
      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="multiple"
          type="selection"
          width="39"
          align="left"
        />
        <el-table-column prop="userName" label="姓名" sortable />
        <el-table-column prop="userCode" label="账号" sortable />
        <el-table-column prop="userTel" label="联系电话" sortable />
        <el-table-column prop="departmentName" label="部门名称" />
        <el-table-column
          v-if="!multiple"
          label="操作"
          align="center"
          width="90"
          class="app-table-oper"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              circle
              icon="el-icon-check"
              @click="check(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <div class="app-pager">
        <el-pagination
          background
          :current-page="listQuery.pageIndex"
          :page-sizes="[10, 20, 50, 100, 1000, 10000]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
          :pager-count="5"
          @size-change="pagerSizeChange"
          @current-change="pagerCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { list } from "../../../api/user";
import { list as deplist } from "../../../api/department";
import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import excel from '../../../utils/excel'
// import Pagination from '../../../components/Pagination'
// import Upload from '../../../components/Upload'

export default {
  name: "Table",
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "选择用户";
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    show: {
      type: Boolean,
      required: true,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      // 数据列表加载动画
      loading: true,
      deptree: [],
      editShow: false,
      editId: null,
      // 查询列表参数对象
      listQuery: {
        userName: null,
        depId: null,
        isShowDep: 1,
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
    };
  },
  created() {
    this.getDepList();
    this.getMainData();
  },
  methods: {
    /**
     * 表格多选回调事件
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getMainData();
    },
    getDepList() {
      const that = this;
      deplist()
        .then((res) => {
          that.deptree = res;
        })
        .catch(() => {});
    },
    /**
     * 分页数据加载
     */
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
     * 树状下拉框重构数据
     */
    treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
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
      this.$emit("close", null);
    },
    check(data) {
      if (data != null) {
        this.multipleSelection = [];
        this.multipleSelection.push(data);
      }

      this.$emit("close", { data: this.multipleSelection });
    },
    reset() {
      this.multipleSelection = [];
      this.listQuery.pageIndex = 1;
      this.getMainData();
    },
  },
};
</script>

<style lang="less" scoped>
.vue-treeselect {
  width: 300px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: bottom;
  .vue-treeselect__control {
    height: 30px;
    line-height: 30px;
  }
  .vue-treeselect__input {
    height: 30px;
    line-height: 30px;
  }
}
</style>
