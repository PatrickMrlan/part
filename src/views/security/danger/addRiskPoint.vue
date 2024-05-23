<template>
  <myDialog
    :title="title"
    :cancel="cancel"
    :loading="loading"
    :visible="true"
    width="500px"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="formRules">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="风险单元（场所、区域）名称：" prop="value">
            <el-input
              v-model.trim="dialogForm.value"
              type="text"
              placeholder="请输入风险单元（场所、区域）名称"
              clearable
            />
          </el-form-item>
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
import { addRiskPoint } from "@/api/security/danger";

export default {
  props: {
    title: {
      required: true,
      default() {
        return "";
      },
    },
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
      dialogForm: {
        value: null,
        id: null,
      },
      formRules: {
        value: [
          {
            required: true,
            message: "请输入风险单元（场所、区域）名称",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          that.dialogForm.id = that.id;
          addRiskPoint(that.dialogForm)
            .then((res) => {
              that.loading = false;
              that.$message({
                type: "success",
                message: "操作成功",
              });
              that.$emit("close", { reload: true });
            })
            .catch(() => {
              that.loading = false;
            });
        } else {
          return false;
        }
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
/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-input {
  width: 100% !important;
}
</style>