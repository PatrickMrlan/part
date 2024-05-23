<template>
  <myDialog
    :title="title"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'10vh'"
  >
    <el-form ref="dialogForm" :model="dialogForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="菜单功能授权" name="menuEmpower">
              <div class="content" ref="appRowHeight">
                <el-table
                  :data="tableData"
                  ref="table"
                  style="width: 100%"
                  row-key="id"
                  default-expand-all
                  border
                  :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren',
                  }"
                  @select="handleSelect"
                  @select-all="handleSelectAll"
                  @selection-change="handleSelectionChange"
                  :select-on-indeterminate="false"
                  :height="screenHeight"
                >
                  <el-table-column
                    prop="name"
                    label="菜单名称"
                    align="left"
                    width="200px"
                  >
                  </el-table-column>
                  <el-table-column prop="name" label="权限分配" align="center">
                    <template slot-scope="scope">
                      <el-checkbox-group
                        v-model="dialogForm.menuOperIdList"
                        v-for="(item, index) in scope.row
                          .sysMenuOperationalList"
                        :key="index"
                      >
                        <el-checkbox
                          :label="item.menuOperId"
                          :checked="item.isSelect == '1' ? true : false"
                          >{{ item.operName }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column type="selection" width="40" align="center" /> -->
                  <el-table-column width="80px" align="center">
                    <template slot="header">
                      <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange"
                        >全选</el-checkbox
                      >
                    </template>
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.checked"
                        @change="handleCheckChange(scope.row)"
                      ></el-checkbox>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="数据授权" name="dataEmpower"
              >数据授权</el-tab-pane
            >
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="submitForm('dialogForm')"
      >
        提 交
      </el-button>
    </template>
  </myDialog>
</template>

<script>
import { detail, edit } from "../../../api/role";
import { Message } from "element-ui";
import treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { treeselect },
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑用户";
      },
    },
    id: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      activeName: "menuEmpower",
      dialogForm: {
        roleId: null,
        roleName: null,
        description: null,
        roleType: null,
        menuOperIdList: [],
      },
      tableData: [], // 多选数据暂存数组
      multipleSelection: [],
      screenHeight: null,
      checkAll: false, // 判断当前是否全选
      isIndeterminate: true,
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.screenHeight = window.innerHeight;
      const h = this.$refs.appRowHeight.offsetHeight;
      this.screenHeight = this.screenHeight - h - 128;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /**
     * 表格多选回调事件
     */
    handleSelectionChange(val) {
      console.log("发生变化", val);
      const that = this;
      that.multipleSelection = val;
      console.log(that.multipleSelection);
      console.log(that.dialogForm.menuOperIdList);
      that.multipleSelection.forEach((item) => {
        console.log(item);
      });
    },
    handleSelectAll(val) {
      console.log("全选", val);
    },
    handleSelect(val) {
      console.log("勾选一行", val);
    },
    handleCheckAllChange(val) {
      console.log(val);
    },
    handleCheckChange(data) {
      console.log(data);
      console.log(data.checked);
      if (data.checked) {
        data.sysMenuOperationalList.forEach((item) => {
          item.isSelect = "1";
          this.dialogForm.menuOperIdList.push(item.menuOperId);
        });
      } else {
        data.sysMenuOperationalList.forEach((item) => {
          console.log(item);
          item.isSelect = "0";
          const index = this.dialogForm.menuOperIdList.indexOf(item.menuOperId);
          console.log(index);
          if (index > -1) {
            this.dialogForm.menuOperIdList.splice(index, 1);
          }
        });
      }
      console.log(this.dialogForm.menuOperIdList);
    },
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ roleId: this.id })
        .then((res) => {
          console.log(res);
          that.loading = false;
          that.tableData = res.menuList;
          this.dialogForm = {
            roleId: res.sysRole.roleId,
            roleName: res.sysRole.roleName,
            description: res.sysRole.description,
            roleType: res.sysRole.roleType,
            menuOperIdList: [],
          };
        })
        .catch(() => {
          that.loading = false;
        });
    },
    /**
     * 数据提交
     */
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          edit(that.dialogForm)
            .then((res) => {
              that.loading = false;
              Message({
                type: "success",
                message: "操作成功",
              });
              this.$emit("close", { reload: true });
            })
            .catch(() => {
              that.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.vue-treeselect {
  width: 300px;
  .vue-treeselect__control {
    height: 32px;
    line-height: 32px;
  }
  .vue-treeselect__input {
    height: 32px;
    line-height: 32px;
  }
}
/deep/.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 18px;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
/deep/#pane-menuEmpower {
  .el-table__body {
    .el-table__row {
      td:nth-of-type(2) {
        .cell {
          display: flex;
          align-items: center;
          .el-checkbox {
            width: 70px;
          }
        }
      }
    }
  }
}
</style>
