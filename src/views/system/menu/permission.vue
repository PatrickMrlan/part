<template>
  <myDialog
    :title="title"
    width="1000px"
    :loading="loading"
    :visible="true"
    class="dialog-form"
    :cancel="cancel"
  >
    <el-form ref="dialogForm" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="toolsRight">未授权操作</div>
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
              prop="operateName"
              label="操作名称"
            />
          </el-table>
        </el-col>
        <el-col :span="1">
          <div class="button">
            <myButton
              @click.native="addStaff"
              type="circle"
              icon="el-icon-arrow-right"
              circle
            />
            <myButton
              @click.native="removeStaff"
              type="circle"
              icon="el-icon-arrow-left"
              circle
            />
          </div>
        </el-col>
        <el-col :span="17">
          <div class="toolsRight">已授权操作</div>
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
              prop="operateName"
              width="100px"
              label="操作名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="operateValue"
              width="100px"
              label="键值"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="请求地址" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-input v-model="scope.row.requestUrl" clearable />
              </template>
            </el-table-column>
            <el-table-column label="请求参数" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.requestParam" clearable />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton :loading="loading" @click.native="submitForm('dialogForm')">
        确 定
      </myButton>
    </template>
  </myDialog>
</template>

<script>
import { Message } from "element-ui";
import { operateList, operateAddList, operateDetail } from "@/api/menu";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "操作权限配置";
      },
    },
    menuId: {
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      /**
       * 此页面的操作权限
       */
      pageOper: this.getPageOper(this.$route),
      loading: false,

      tableDataLeft: [],
      tableDataRight: [],
      multipleSelectionLeft: [],
      multipleSelectionRight: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 根据id加载数据
    async loadData() {
      const that = this;
      that.loading = true;
      await operateList({ menuId: this.menuId })
        .then((res) => {
          that.loading = false;
          that.tableDataRight = res.records;
        })
        .catch(() => {
          that.loading = false;
        });
      await operateDetail().then((res) => {
        that.tableDataLeft = res.operateList;
        that.tableDataRight.forEach((item) => {
          that.tableDataLeft.forEach((itemSon, index) => {
            if (item.operateId == itemSon.id) {
              that.tableDataLeft.splice(index, 1);
            }
          });
        });
      });
    },

    handleSelectionChangeAdd(e) {
      this.multipleSelectionLeft = e;
    },
    handleSelectionChangeRemove(e) {
      this.multipleSelectionRight = e;
    },
    addStaff() {
      const that = this;
      if (that.multipleSelectionLeft.length <= 0) {
        Message({
          type: "warning",
          message: "请选择未授权操作",
        });
        return;
      }
      that.multipleSelectionLeft.forEach((item) => {
        item.operateId = item.id;
        item.menuId = that.menuId;
        item.requestParam = "";
        item.requestUrl = "";
        that.tableDataRight.push(item);
        that.tableDataLeft.forEach((itemSon, index) => {
          if (item.id == itemSon.id) {
            that.tableDataLeft.splice(index, 1);
          }
        });
      });
      this.multipleSelectionLeft = [];
    },
    removeStaff() {
      const that = this;
      if (that.multipleSelectionRight.length <= 0) {
        Message({
          type: "warning",
          message: "请选择已授权操作",
        });
        return;
      }
      that.multipleSelectionRight.forEach((item) => {
        that.tableDataLeft.push(item);
        that.tableDataRight.forEach((itemSon, index) => {
          if (item.id == itemSon.id) {
            that.tableDataRight.splice(index, 1);
          }
        });
      });
      that.multipleSelectionRight = [];
    },

    // 关闭弹窗
    cancel(done) {
      this.$emit("close", {});
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
      operateAddList(that.tableDataRight)
        .then((res) => {
          that.loading = false;
          Message({
            type: "success",
            message: "操作成功",
          });
          this.cancel();
        })
        .catch((error) => {
          that.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
// /deep/.el-dialog{
//   height: 485px !important;
// }
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
