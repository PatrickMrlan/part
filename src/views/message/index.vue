<template>
  <div class="table-classic-wrapper">
    <!-- 操作栏 -->
    <div class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          class="input-long"
          clearable
          placeholder="标题"
          @keyup.native.enter="search"
        />
        <el-select
          v-model="listQuery.type"
          class="input-normal"
          clearable
          placeholder="消息类型"
          @change="search"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="listQuery.isRead"
          class="input-normal"
          clearable
          placeholder="是否已读"
          @change="search"
        >
          <el-option
            v-for="item in isReadList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>

        <el-button icon="el-icon-close" circle @click="deleteConditions" />
        <myButton :type="'search'" icon="el-icon-search" @click.native="search"
          >搜索</myButton
        >
      </div>
      <div class="right"></div>
    </div>
    <!-- 表格栏 -->
    <myTable
      ref="fileTable"
      :show-index="true"
      :selection="false"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="true"
      :table-data="tableData"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      export-file-name="信息管理"
      custom-label="操作"
      custom-label-width="80px"
      :row-key="rowKey"
      @change="multiple"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span title="查看" @click="edit(scope.data.row)">查看</span>
        </myHandle>
      </template>
    </myTable>
    <edit v-if="editShow" :id="editId" title="查看消息" @close="editColse" />
  </div>
</template>

<script>
import { Message } from "element-ui";
import { getEnumList, list } from "@/api/message";

// import excel from '../../../utils/excel'
// import Pagination from '../../../components/Pagination'
// import Upload from '../../../components/Upload'
import edit from "./edit.vue";
export default {
  name: "Table",
  components: { edit },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),

      // 数据列表加载动画
      loading: true,
      // 查询列表参数对象
      listQuery: {
        keyword: null,
        isRead: null,
        type: null,
        pageIndex: 1,
        pageSize: 10,
      },
      typeList: [],
      isReadList: [
        {
          key: "未读",
          value: 0,
        },
        {
          key: "已读",
          value: 1,
        },
      ],
      // 筛选列
      checked: [
        { key: "消息标题", val: "noticeTitle" },
        {
          key: "消息类型",
          val: "noticeType",
          align: "center",
          width: "150px",
        },
        { key: "来源名称", val: "sourceName" },
        { key: "来源类型", val: "sourceType", align: "center", width: "100px" },
        { key: "是否已读", val: "readStr", align: "center", width: "100px" },
        {
          key: "添加时间",
          val: "addTime",
          align: "center",
          sortable: "true",
          width: "160px",
        },
      ],
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      editShow: false,
      editId: null,
      readData: null,
    };
  },
  created() {
    this.getEnumList();
    this.getMainData();
  },
  methods: {
    
    /**
     * 清空 输入和选择的条件
     */
    deleteConditions() {
      this.listQuery.keyword = null;
      this.listQuery.isRead = null;
      this.listQuery.type = null;
      this.search();
    },
    /**
     * 表格多选回调事件
     */
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

    getEnumList() {
      getEnumList().then((res) => {
        this.typeList = res.projectNoticeTypeList;
      });
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
          that.tableData = JSON.parse(JSON.stringify(res.records));

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
     * 关闭编辑页面
     */
    editColse(data) {
      this.editShow = false;
      // if (data.reload) {
      this.getMainData();

      // }
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      console.log(data);
      if (data == null) {
        this.editId = null;
      } else {
        this.editId = data.id;
      }
      this.editShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
