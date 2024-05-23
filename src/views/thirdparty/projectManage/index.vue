<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          class="input-long"
          clearable
          placeholder="项目名称"
          @keyup.native.enter="search"
        />
        <el-select
          v-model="listQuery.projectState"
          class="input-normal"
          clearable
          placeholder="项目状态"
          @change="search"
        >
          <el-option
            v-for="item in projectStateList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
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
    <!-- 表格栏 -->
    <myTable
      ref="fileTable"
      :show-index="true"
      :selection="true"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="true"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      custom-label="操作"
      custom-label-width="120px"
      :row-key="rowKey"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="编辑" v-if="pageOper.XG" @click="edit(scope.data.row)"
            >编辑</span
          >
          <span title="删除" v-if="pageOper.SC" @click="remove(scope.data.row)"
            >删除</span
          >
        </myHandle>
      </template>
    </myTable>

    <edit
      v-if="editShow"
      :visible="editShow"
      :id="editId"
      :title="titleName"
      @close="editColse"
    />
  </div>
</template>

<script>
import { list, remove, enumList } from "@/api/thirdparty/projectManage";
import edit from "./edit.vue";

export default {
  components: { edit },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,

      listQuery: {
        keyword: null,
        projectState: null,
        pageIndex: 1,
        pageSize: 10,
      },
      checked: [
        { key: "项目名称", val: "projectName" },
        { key: "项目详情", val: "projectDetail" },
        {
          key: "项目状态",
          val: "projectState",
          align: "center",
          width: "120px",
        },
        { key: "开始时间", val: "startTime", align: "center", width: "150px" },
        { key: "结束时间", val: "endTime", align: "center", width: "150px" },
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      editShow: false,
      editId: null,
      titleName: null,

      projectStateList: [],
    };
  },
  created() {
    this.getEnumList();
    this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.projectId;
    },
    /**
     * 获取枚举
     */
    getEnumList() {
      enumList().then((res) => {
        this.projectStateList = res.projectStateList;
      });
    },

    /**
     * 分页数据加载
     */
    getMainData() {
      const that = this;
      that.loading = true;
      list(that.listQuery)
        .then((res) => {
          that.tableData = JSON.parse(JSON.stringify(res.records));
          that.listQuery.pageSize = res.size;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
        })
        .finally(() => {
          that.loading = false;
        });
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
      list({
        pageIndex: 1,
        pageSize: total,
      })
        .then((res) => {
          that.$refs.fileTable.exportTable(res.records);
        })
        .finally(() => {
          that.loading = false;
        });
    },

    /**
     * 表格多选回调事件
     */
    multiple(e) {
      this.multipleSelection = e;
    },

    //删除
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
        that.$message({
          type: "warning",
          message: "请选择需要删除的数据!"
        });
        return;
      } else {
        deleteData.forEach(item => {
          ids.push(item.projectId);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;

          remove(ids)
            .then(res => {
              that.$message({
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
      console.log(data);
      if (data == null) {
        this.editId = null;
        this.titleName = "新增项目";
      } else {
        this.editId = data.projectId;
        this.titleName = "编辑项目";
      }
      this.editShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>