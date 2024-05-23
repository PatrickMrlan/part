<template>
  <myDialog
    :title="title"
    width="480px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :loading="loading"
    :top="'20vh'"
  >
    <el-form
      v-loading="loading"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="120px"
    >
      <el-row :gutter="20">
          <el-form-item label="角色名称：" prop="roleName">
            <el-input
              v-model="dialogForm.roleName"
              type="text"
              placeholder="请输入角色名称"
              clearable
              maxlength="20"
              class="input-default"
            />
          </el-form-item>

          <el-form-item label="角色描述：" prop="remake">
            <el-input
              v-model="dialogForm.remake"
              type="textarea"
              :rows="6"
              max="50"
              class="input-default"
              placeholder="角色描述"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
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
import { detail, add, edit } from "@/api/role";
export default {
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "编辑用户";
      }
    },
    id: {
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      loading: false,
      formRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: ["change", "blur"]
          },
          {
            max: 20,
            message: "角色名称长度不能大于20",
            trigger: ["blur", "change"]
          }
        ],
        roleCode: [
          {
            required: true,
            message: "请输入角色编码",
            trigger: ["change", "blur"]
          }
        ]
      },
      dialogForm: {}
    };
  },
  async created() {
    if (this.id) {
      await this.loadData();
    }
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },
    loadData() {
      const that = this;
      that.loading = true;
      detail({ roleId: that.id })
        .then(res => {
          console.log(res.role);
          that.dialogForm = res.role;
          //   that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm));
        })
        .finally(() => {
          that.loading = false;
        });
    },
    submitForm(formName) {
      const that = this;
      if (that.loading) {
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.loading = true;
          if (that.id) {
            edit(that.dialogForm)
              .then(res => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功"
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          } else {
            add(that.dialogForm)
              .then(res => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "操作成功"
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.input-default textarea {
  height: 44vh;
}
</style>