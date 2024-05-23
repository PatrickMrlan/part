<template>
  <myDialog
    title="管理模块"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="800px"
  >
    <el-form ref="dialogForm">
      <el-row :gutter="20">
        <el-col :span="11">
          <div class="toolsRight">未展示模块</div>
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableDataLeft"
            tooltip-effect="dark"
            style="width: 100%"
            size="small"
            height="50vh"
            border
            @selection-change="handleSelectionChangeAdd"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="moduleName"
              label="模块名称"
            />
          </el-table>
        </el-col>
        <el-col :span="1">
          <div class="button">
            <myButton
              @click.native="addmodule"
              type="circle"
              icon="el-icon-arrow-right"
              circle
            />
            <myButton
              @click.native="removemodule"
              type="circle"
              icon="el-icon-arrow-left"
              circle
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="toolsRight">已展示模块</div>
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableDataRight"
            tooltip-effect="dark"
            style="width: 100%"
            size="small"
            height="50vh"
            border
            @selection-change="handleSelectionChangeRemove"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="moduleName"
              label="模块名称"
            />
          </el-table>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
        >提 交</myButton
      >
    </template>
  </myDialog>
</template>

<script>
import { moduleList, moduleEdit, allList } from "@/api/system/module.js";
import { Message } from "element-ui";

export default {
  props: {
    id: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,

      tableDataLeft: [],
      tableDataRight: [],
      multipleSelectionLeft: [],
      multipleSelectionRight: [],

      allmodule: [
        {
          moduleName: "统计",
          moduleCode: "statistics",
        },
        {
          moduleName: "审批任务",
          moduleCode: "approval_task",
        },
        {
          moduleName: "灾害预警",
          moduleCode: "disaster_warning",
        },
        {
          moduleName: "调查报告",
          moduleCode: "investigation_report",
        },
        {
          moduleName: "快捷导航",
          moduleCode: "quick_navigation",
        },
        {
          moduleName: "风险预警",
          moduleCode: "risk_warning",
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      await allList()
        .then((res) => {
          this.tableDataLeft = [...res];
        })
        .finally(() => {
          this.loading = false;
        });

      this.loading = true;
      await moduleList()
        .then((res) => {
          if (res.length > 0) {
            this.tableDataRight = res;
            this.tableDataRight.forEach((item, index) => {
              this.tableDataLeft.forEach((itemSon, i) => {
                if (item.moduleCode == itemSon.moduleCode) {
                  this.tableDataLeft.splice(i, 1);
                }
              });
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleSelectionChangeAdd(e) {
      this.multipleSelectionLeft = e;
    },
    handleSelectionChangeRemove(e) {
      this.multipleSelectionRight = e;
    },

    addmodule() {
      const that = this;
      if (that.multipleSelectionLeft.length <= 0) {
        Message({
          type: "warning",
          message: "请选择展示模块",
        });
        return;
      }
      that.multipleSelectionLeft.forEach((item) => {
        that.tableDataRight.push(item);
        that.tableDataLeft.forEach((itemSon, index) => {
          if (item.moduleCode == itemSon.moduleCode) {
            that.tableDataLeft.splice(index, 1);
          }
        });
      });
      this.multipleSelectionLeft = [];
    },
    removemodule() {
      const that = this;
      if (that.multipleSelectionRight.length <= 0) {
        Message({
          type: "warning",
          message: "请选择已展示模块",
        });
        return;
      }
      that.multipleSelectionRight.forEach((item) => {
        that.tableDataLeft.push(item);
        that.tableDataRight.forEach((itemSon, index) => {
          if (item.moduleCode == itemSon.moduleCode) {
            that.tableDataRight.splice(index, 1);
          }
        });
      });
      that.multipleSelectionRight = [];
    },

    submitForm() {
      const that = this;
      if (that.loading) {
        return;
      }
      if (that.tableDataRight.length == 0) {
        Message({
          type: "warning",
          message: "请添加授权应用",
        });
        return;
      }
      that.loading = true;

      moduleEdit(that.tableDataRight)
        .then((res) => {
          Message({
            type: "success",
            message: "操作成功",
          });
          this.$emit("close", { reload: true });
        })
        .finally((error) => {
          that.loading = false;
        });
    },

    // 取消
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  min-height: 60vh;

  .el-table {
    min-height: 50vh;
  }

  .toolsRight {
    flex-direction: row;
  }

  .el-range-editor--small {
    width: 285px;
  }
}

.button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  & > * {
    width: 32px;
    height: 32px;
  }
}
</style>