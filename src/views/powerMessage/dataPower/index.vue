<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div class="app-list-control app-row" ref="appRowHeight">
      <div class="flex"></div>
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
      :tableData.sync="tableData"
      :DCAuthority="pageOper.DC"
      :total.sync="total"
      :pageIndex="listQuery.pageIndex"
      exportFileName="数据权限管理"
      customLabel="操作"
      customLabelWidth="120px"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      :rowKey="rowKey"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
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
  </div>
</template>

<script>
import { list, remove } from "@/api/system/dataPower";
import edit from "./edit";
// 导出
import excel from "@/utils/excel";
//打印
import printJS from "print-js";
import { Message } from "element-ui";

export default {
  name: "Table",
  components: { edit },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,
      editShow: false,
      editId: null,
      listQuery: {
        appId: null,
        pageIndex: 1,
        pageSize: 10,
      },
      // 新增/修改 标题
      titleName: null,
      // 显示的列
      // 筛选列
      checked: [
        { key: "权限标题", val: "dataCode" },
        { key: "权限编码", val: "dataSelect" },
        { key: "权限条件", val: "dataTitle" },
        { key: "备注", val: "remake" },
        { key: "添加时间", val: "addTime", align: "center" },
      ],
      // 展示列表
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
      return row.userId;
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
          this.tableData.forEach((item) => {
            for (var i in item) {
              if (i !== 0) {
                item[i] = item[i] || "--";
              }
            }
          });
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
      console.log(data);
      if (data == null) {
        this.editId = null;
        this.titleName = "新增权限";
      } else {
        this.editId = data.id;
        this.titleName = "修改权限";
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
        that.multipleSelection.forEach((item) => {
          deleteData.push(item.id);
        });
      } else {
        deleteData = [data.id];
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

<style lang="less" scoped></style>
