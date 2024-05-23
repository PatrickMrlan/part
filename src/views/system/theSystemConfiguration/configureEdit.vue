<template>
  <myDialog
    :title="title"
    width="450px"
    :loading="loading"
    :visible="true"
    class="dialog-form"
    :cancel="cancel"
    top="20vh"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <div class="app-form-content">
          <el-form-item label="配置编码" prop="configureTypeCode">
            <el-input
              v-model.trim="dialogForm.configureTypeCode"
              type="text"
              class="input-default"
              placeholder="配置编码"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="配置项" prop="remark">
            <el-input
              v-model.trim="dialogForm.remark"
              type="text"
              class="input-default"
              placeholder="配置项"
              maxlength="20"
            />
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <template slot="footer">
      <myButton :type="'cancel'" @click.native="cancel">取 消</myButton>
      <myButton
        :type="'confirm'"
        icon="el-icon-loading"
        :loading="loading"
        @click.native="submitForm('dialogForm')"
      >
        提 交
      </myButton>
    </template>
  </myDialog>
</template>

<script>
import {
  treeEdit,
  treeAdd,
  treeDetail,
} from "@/api/system/theSystemConfiguration";
import { Message } from "element-ui";

export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "编辑信息";
      },
    },
    id: {
      required: false,
      default() {
        return null;
      },
    },
    pid: {
      required: true,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      loading: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      dialogForm: {
        remark: "", // 配置项
        configureTypeCode: "", // 配置编码
        parentConfigureTypeId: null, // 上级配置类型标识
      },
      formRules: {
        configureTypeCode: [
          { required: true, message: "请输入配置编码！", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入配置项！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    console.log(this.pid);

    this.loadData();
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      treeDetail({ id: that.id })
        .then((res) => {
          console.log(res);
          that.loading = false;
          that.dialogForm = res.entity;
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
          if (that.id) {
            treeEdit(that.dialogForm)
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
            if (this.pid) {
              this.dialogForm.parentConfigureTypeId = this.pid;
            }
            treeAdd(that.dialogForm)
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
          }
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.describe {
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>
