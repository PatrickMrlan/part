<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex" />
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
      :show-index="true"
      :selection="true"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      custom-label="操作"
      custom1Label="是否使用"
      custom-label-width="170px"
      custom1label-width="80px"
      :row-key="rowKey"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom1" slot-scope="scope">
        <el-tooltip :content="scope.data.row.isDisable" placement="left">
          <el-switch
            v-model="scope.data.row.isDisable"
            active-value="正常"
            inactive-value="禁用"
            @change="changeDisable(scope.data.row)"
          />
        </el-tooltip>
      </template>
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <!-- <span title="授权" @click="empowerEdit(scope.data.row)">授权</span> -->
          <!-- <span title="查看" @click="empower(scope.data.row)">查看</span> -->
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>

    <edit v-if="editShow" :id="editId" :title="titleName" @close="editColse" />
    <empowerIndex
      v-if="empowerShow"
      :id="empowerId"
      :title="titleName"
      @close="empowerColse"
    />
    <empowerEdit
      v-if="empowerEditShow"
      :id="empowerEditId"
      :app-id="appId"
      :title="titleName"
      @close="empowerEditColse"
    />
  </div>
</template>
<script>
import { list, remove, disable } from "@/api/system/applicationManagement";
import edit from "./edit";
import empowerIndex from "./empowerIndex.vue";
import empowerEdit from "./empowerEdit.vue";
// 导出
import excel from "@/utils/excel";
// 打印
import printJS from "print-js";
import { Message } from "element-ui";
import MyButton from "../../../components/myButton.vue";

export default {
  name: "Table",
  components: { edit, empowerIndex, empowerEdit, MyButton },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      editShow: false,
      editId: null,
      empowerShow: false,
      empowerEditShow: false,
      empowerId: null,
      empowerEditId: null,
      listQuery: {
        keywords: null,
        pageIndex: 1,
        pageSize: 10,
      },
      menuShow: false,
      // 新增/修改 标题
      titleName: null,
      // 筛选列
      checked: [
        { key: "应用名称", val: "appName", width: "150px" },
        { key: "跳转链接", val: "appUrl" },
        { key: "跳转类型", val: "jumpType", width: "150px" },
        { key: "跳转方式", val: "jumpMode", width: "150px" },
        {
          key: "是否控制使用时间",
          val: "isUseTime",
          width: "150px",
          align: "center",
        },
        // { key: "是否禁止使用", val: "isDisable", align: "center" },
        {
          key: "排序",
          val: "sort",
          align: "center",
          width: "100px",
          sortable: true,
        },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      screenHeight: null,
    };
  },
  mounted() {
    this.getMainData();
  },

  methods: {
    rowKey(row) {
      return row.id;
    },
    /**
     * 是否禁用
     */
    changeDisable(data) {
      console.log(data);
      const that = this;
      that.loading = true;
      disable(data.id)
        .then((res) => {
          Message({
            type: "success",
            message: "操作成功",
          });
          that.loading = false;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    /**
     * 搜索
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
      // index 为 null 时添加
      if (data == null) {
        this.editId = null;
        this.titleName = "新增应用";
      } else {
        this.editId = data.id;
        this.titleName = "修改应用";
      }
      this.editShow = true;
    },
    /**
     * 授权
     */
    empower(data) {
      this.titleName = "应用授权的企业";
      this.empowerId = data.id;
      this.empowerShow = true;
    },
    empowerColse(data) {
      this.empowerShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    empowerEdit(data) {
      this.titleName = "应用授权操作";
      this.empowerEditId = null;
      this.appId = data.id;
      this.empowerEditShow = true;
    },
    empowerEditColse(data) {
      this.empowerEditShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    /**
     * 删除/批量删除事件
     */
    remove(data) {
      console.log(data);
      const that = this;
      let deleteData = [];

      if (data == null) {
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.id);
        });
      } else {
        deleteData = [data.id];
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
              that.loading = false;
              Message({
                type: "success",
                message: "操作成功",
              });
              that.search();
            })
            .catch(() => {
              that.loading = false;
            });
        })
        .catch(() => {
          // 取消删除
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
