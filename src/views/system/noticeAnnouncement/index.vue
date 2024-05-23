<template>
  <div class="table-classic-wrapper">
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model.trim="listQuery.keyword"
          placeholder="通知标题/通知内容"
          clearable
          class="input-long"
          @keyup.native.enter="search"
        />
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
      :DCAuthority="pageOper.DC"
      :tableData.sync="tableData"
      :total.sync="total"
      :pageIndex="listQuery.pageIndex"
      custom-label="操作"
      customLabelWidth="120px"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
      :rowKey="rowKey"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span
            v-if="scope.data.row.isSend == '否'"
            title="下发"
            @click="issued(scope.data.row)"
            >下发</span
          >
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
    <issued
      v-if="issuedShow"
      :id="issuedId"
      :title="titleName"
      :issued-data="issuedData"
      @close="issuedColse"
    />
  </div>
</template>

<script>
import { list, remove, send } from "@/api/system/noticeAnnouncement";
import { Message } from "element-ui";
import edit from "./edit";
import issued from "./issued";

export default {
  name: "Table",
  components: { edit, issued },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      // 数据列表加载动画
      loading: false,
      listQuery: {
        keyword: null, // 配置值
        pageIndex: 1,
        pageSize: 10,
      },
      // 新增/修改 标题
      titleName: null,
      // 筛选列
      checked: [
        { key: "通知标题", val: "noticeTitle" },
        { key: "通知内容", val: "noticeContent" },
        {
          key: "通知人员类型",
          val: "noticeType",
          align: "center",
          width: "150px",
        },
        {
          key: "添加时间",
          val: "addTime",
          align: "center",
          sortable: "true",
          width: "150px",
        },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      editShow: false,
      editId: null,
      issuedShow: false,
      issuedId: null,
      issuedData: [],
    };
  },
  created() {
    this.getMainData();
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    multiple(e) {
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
     * 删除/批量删除事件
     */
    remove(data) {
      console.log(data);
      const that = this;
      let deleteData = [];
      if (data == null) {
        deleteData = that.multipleSelection;
      } else {
        deleteData.push(data);
      }
      console.log(deleteData);
      var ids = [];

      if (deleteData.length === 0) {
        Message({
          type: "warning",
          message: "请选择需要删除的数据!",
        });
        return;
      } else {
        deleteData.forEach((item) => {
          ids.push({
            id: item.id,
            value: item.configureValue,
          });
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          remove(ids)
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
    /**
     * 修改按钮点击事件
     */
    edit(data) {
      if (data) {
        this.titleName = "修改通知公告";
        this.editId = data.id;
      } else {
        this.titleName = "新增通知公告";
        this.editId = null;
      }
      this.editShow = true;
    },
    /**
     * 关闭修改页面
     */
    editColse(data) {
      this.editShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
    /**
     * 下发按钮点击事件
     */
    issued(data) {
      this.issuedData = [];
      if (data) {
        this.issuedId = null;
        this.issuedData.push(data);
      } else {
        this.issuedId = null;
        if (this.multipleSelection.length === 0) {
          Message({
            type: "warning",
            message: "请选择需要下发的公告!",
          });
          return;
        }
        this.issuedData = this.multipleSelection;
      }
      this.titleName = "下发通知公告";
      this.issuedShow = true;
    },
    /**
     * 关闭下发页面
     */
    issuedColse(data) {
      this.issuedShow = false;
      if (data.reload) {
        this.getMainData();
      }
    },
  },
};
</script>

<style lang="less" scoped></style>

