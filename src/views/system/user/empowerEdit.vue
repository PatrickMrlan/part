<template>
  <el-dialog
    :title="title"
    class="dialog-form"
    :visible="true"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :destroy-on-close="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    top="20vh"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="菜单功能授权" name="menuEmpower"
              >菜单功能授权</el-tab-pane
            >
            <el-tab-pane label="数据授权" name="dataEmpower"
              >数据授权</el-tab-pane
            >
          </el-tabs>
        </el-col>
      </el-row>
      <div class="footer-item">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm('dialogForm')"
        >
          提 交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { detail, edit, passWordDetail } from "../../../api/user";
import { list } from "../../../api/department";
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
    depid: {
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
        depId: null,
      },
    };
  },
  created() {
    this.dialogForm.depId = this.depid;
  },
  methods: {
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
/deep/.el-checkbox {
  min-width: 100px;
}
</style>
