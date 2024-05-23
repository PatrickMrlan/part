<template>
  <div class="table-classic-wrapper">
    <div class="nameBox">
      <span style="color: black; font-size: 15px; margin-top: 0px"
        >安全生产总体目标</span
      >
    </div>
    <div class="right">
      <myButton
        v-if="tag == 0"
        :type="'confirm'"
        icon="el-icon-plus"
        @click.native="changeTag(1)"
        >编辑</myButton
      >
      <myButton
        v-if="tag == 1"
        :type="'confirm'"
        icon="el-icon-delete"
        @click.native="changeTag(0)"
        >保存</myButton
      >
      <myButton
        v-if="tag == 1"
        :type="'confirm'"
        icon="el-icon-delete"
        @click.native="changeTag(2)"
        >取消</myButton
      >
    </div>
    <div class="editBox" style="height: 20%">
      <div
        v-html="targetData"
        v-show="tag == 0"
        style="overflow: auto; height: 200px"
      ></div>
      <el-form
        ref="dialogForm"
        v-loading="loading"
        style="min-height: 100%"
        :model="dialogForm"
        v-show="tag == 1"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <span>总目标内容</span>
            <el-form-item label="" prop="targetContent">
              <Editor v-model="dialogForm.targetContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="nameBox">
      <span style="color: black; font-size: 15px">安全生产年度目标</span>
    </div>
    <!-- 操作栏 -->
    <div ref="appRowHeight" class="app-list-control app-row">
      <div class="flex">
        <el-input
          v-model="listQuery.keyword"
          placeholder="输入标题进行检索"
          class="input-long"
          clearable
          @keyup.enter.native="search"
        />
        <el-select
          v-model="listQuery.planYear"
          placeholder="年份"
          class="input-normal"
          clearable
        >
          <el-option
            v-for="item in planYearList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

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
          v-if="pageOper.DR && targetId"
          icon="el-icon-upload2"
          @click.native="upload"
          >导入</myButton
        >
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
    <myTable
      ref="fileTable"
      :show-index="true"
      :selection="true"
      :checked="checked"
      :loading.sync="loading"
      :d-c-authority="pageOper.DC"
      :total.sync="total"
      :page-index="listQuery.pageIndex"
      :table-data="tableData"
      custom-label="操作"
      custom-label-width="200px"
      :row-key="rowKey"
      @change="multiple"
      :on-resize-height="118"
      @pageSizeChange="pagerSizeChange"
      @pageCurrentChange="pagerCurrentChange"
      @getExportTableData="getExportTableData"
    >
      <template slot="custom" slot-scope="scope">
        <myHandle>
          <span v-if="pageOper.CX" title="详情" @click="detail(scope.data.row)">
            查看详情
          </span>
          <span v-if="pageOper.XG" title="编辑" @click="edit(scope.data.row)">
            编辑
          </span>
          <span v-if="pageOper.SC" title="删除" @click="remove(scope.data.row)">
            删除
          </span>
        </myHandle>
      </template>
    </myTable>
    <edit
      v-if="editShow"
      :id="editId"
      :visible="editShow"
      :title="titleName"
      :targetId="targetId"
      @close="editClose"
    />
    <detail
      v-if="detailShow"
      :id="detailId"
      :visible="detailShow"
      :title="detailtitleName"
      @close="detailClose"
    />
    <upload
      v-if="uploadShow"
      title="导入安全生产年度目标"
      @close="uploadColse"
      :targetId="targetId"
      :entId="loginUser.entId"
    />
  </div>
</template>
<script>
import { list, enumList, del } from "@/api/security/targetplan";
import {
  detailByEId,
  add as targetAdd,
  edit as targetEdit,
  targetDetail,
} from "@/api/security/target";
import edit from "./edit";
import detail from "./detail";
import Editor from "@/components/Editor";
import upload from "./import.vue";
export default {
  components: { edit, detail, Editor, upload },
  data() {
    return {
      pageOper: this.getPageOper(this.$route),
      loading: false,
      checked: [
        { key: "年份", val: "planYear", align: "center", width: "100px" },
        { key: "标题", val: "planName", align: "center", width: "300px" },
        { key: "目标内容", val: "planContent", align: "center" },
        { key: "添加时间", val: "addTime", align: "center", width: "200px" },
      ],
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      total: 0,
      listQuery: {
        entId: null,
        planYear: null,
        keyword: null,
        pageIndex: 1,
        pageSize: 10,
      },
      dialogForm: {
        targetContent: null,
      },
      editShow: false,
      editId: null,
      titleName: null,
      completionStatusList: [], // 枚举
      planYearList: [],
      detailShow: false,
      detailId: null,
      detailtitleName: null,
      loginUser: {},
      targetData: null,
      targetId: null,
      tag: 0,
      uploadShow: false,
    };
  },
  async created() {
    await this.getlist();
    await this.getenumList();
    await this.getTargetDetail();
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
  },
  methods: {
    changeTag(e) {
      const that = this;
      if (e == 1) {
        that.tag = 1;
        console.log(this.dialogForm);
      } else if (e == 2) {
        that.tag = 0;
      } else if (e == 0) {
        if (that.loading) {
          return;
        }
        that.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            that.loading = true;
            if (that.dialogForm.targetId) {
              targetEdit(that.dialogForm)
                .then((res) => {
                  that.loading = false;
                  that.$message({
                    type: "success",
                    message: "修改成功",
                  });
                  that.tag = 0;
                  this.getTargetDetail();
                  this.getlist();
                })
                .catch(() => {
                  that.loading = false;
                });
            } else {
              that.dialogForm.entId = that.loginUser.entId;
              targetAdd(that.dialogForm)
                .then((res) => {
                  that.loading = false;
                  that.$message({
                    type: "success",
                    message: "添加成功",
                  });
                  that.tag = 0;
                  this.getTargetDetail();
                  this.getlist();
                })
                .catch(() => {
                  that.loading = false;
                });
            }
          }
        });
      }
    },
    rowKey(row) {
      return row.postId;
    },
    multiple(e) {
      // console.log(e);
      this.multipleSelection = e;
    },
    getlist() {
      const that = this;
      this.loading = true;
      list(this.listQuery)
        .then((res) => {
          that.loading = false;
          that.tableData = res.records;
          that.listQuery.pageSize = res.size;
          that.listQuery.entId = that.loginUser.entId;
          that.listQuery.pageIndex = res.current;
          that.total = res.total;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    getTargetDetail() {
      const that = this;
      this.loading = true;
      detailByEId({ entId: this.loginUser.entId })
        .then((res) => {
          this.dialogForm = res;
          this.dialogForm.targetContent = res.targetContent;
          this.targetData = res.targetContent;
          this.targetId = res.targetId;
        })
        .catch(() => {
          that.loading = false;
        });
    },
    getenumList() {
      const that = this;
      enumList().then((res) => {
        that.planYearList = res.planYearList;
      });
    },
    /**
     * 编辑/添加按钮点击事件
     */
    edit(data) {
      if (data && data.planId) {
        this.editId = data.planId;
        this.titleName = "编辑目标计划";
      } else {
        this.editId = null;
        this.titleName = "新增目标计划";
      }
      this.editShow = true;
    },
    /**
     * 关闭编辑页面
     */
    editClose(data) {
      this.editShow = false;
      if (data.reload) {
        this.getlist();
      }
    },

    detail(data) {
      this.detailId = data.planId;
      this.detailtitleName = "目标计划详情";
      this.detailShow = true;
    },
    /**
     * 关闭详情页面
     */
    detailClose(data) {
      this.detailShow = false;
      if (data.reload) {
        this.getlist();
      }
    },

    // 删除
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
          message: "请选择需要删除的数据!",
        });
        return;
      } else {
        deleteData.forEach((item) => {
          ids.push(item.planId);
        });
      }
      this.$confirm("确认删除选中的" + deleteData.length + "条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;

          del(ids)
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.getlist();
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
     * 查询按钮事件
     */
    search() {
      this.listQuery.pageIndex = 1;
      this.tableData = [];
      this.getlist();
    },
    /**
     * 每页数量改变事件
     */
    pagerSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.getlist();
    },
    /**
     * 页码改变事件
     */
    pagerCurrentChange(pageIndex) {
      this.listQuery.pageIndex = pageIndex;
      this.getlist();
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
     * 导入
     */
    upload() {
      this.uploadShow = true;
    },

    /**
     * 关闭导入页面
     */
    uploadColse(data) {
      this.uploadShow = false;
      this.getlist();
      this.getTargetDetail();
    },
  },
};
</script>

<style>
.editBox {
  border: 1px outset black;
  margin: 10px;
  padding: 10px;
}
.nameBox {
  border: 1px outset block;
  margin: 10px;
  padding: 10px;
}
</style>
  