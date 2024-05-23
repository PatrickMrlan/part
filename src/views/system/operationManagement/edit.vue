<template>
  <myDialog
    :title="title"
    width="500px"
    class="dialog-form"
    :visible="true"
    :cancel="cancel"
    :top="'20vh'"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-form-item label="操作名称：" prop="operateName">
          <el-input
            v-model.trim="dialogForm.operateName"
            type="text"
            class="input-default"
            placeholder="操作名称"
            clearable
            maxlength="10"
          />
        </el-form-item>
        <el-form-item label="操作标识：" prop="operateValue">
          <el-input
            v-model.trim="dialogForm.operateValue"
            type="text"
            class="input-default"
            placeholder="操作标识"
            clearable
            maxlength="10"
          />
        </el-form-item>
        <el-form-item label="是否系统：" prop="isSystem">
          <el-select
            v-model="dialogForm.isSystem"
            placeholder="请选择"
            filterable
            class="input-default"
            clearable
          >
            <el-option
              v-for="(item, index) in isSystemList"
              :key="index"
              :label="item.key"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="dialogForm.sort" :min="0" :max="999" />
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
import { detail, edit, add } from "@/api/system/operationManagement";
import { Message } from "element-ui";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "编辑角色";
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
        operateName: null, // 操作名称
        operateValue: null, // 操作标识
        isSystem: null, // 是否系统操作
        sort: null, // 排序
      },
      isSystemList: [],
      formRules: {
        operateName: [
          { required: true, message: "请输入操作名称！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 根据id加载数据
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then((res) => {
          console.log(res);
          that.loading = false;
          that.isSystemList = res.yesOrNoList;
          if (that.id) {
            that.dialogForm = res.operate;
          }
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
      console.log(that.dialogForm);
      if (that.loading) {
        return;
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if (that.id) {
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
            add(that.dialogForm)
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
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>

<style lang="less" scoped>
</style>
