<template>
  <myDialog
    :title="title"
    :width="600"
    class="dialog-form"
    :visible="true"
    :loading="loading"
    :cancel="cancel"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-form-item label="应用名称：" prop="appName">
          <el-input
            v-model.trim="dialogForm.appName"
            type="text"
            class="input-default"
            placeholder="应用名称"
            readonly
            @focus="lookupShow = true"
          />
        </el-form-item>
        <el-form-item label="权限编码：" prop="dataCode">
          <el-input
            v-model.trim="dialogForm.dataCode"
            type="text"
            maxlength="50"
            class="input-default"
            placeholder="权限编码"
          />
        </el-form-item>
        <el-form-item label="权限标题：" prop="dataTitle">
          <el-input
            v-model.trim="dialogForm.dataTitle"
            type="text"
            maxlength="50"
            class="input-default"
            placeholder="权限标题"
          />
        </el-form-item>
        <el-form-item label="权限条件：" prop="dataSelect">
          <el-input
            v-model.trim="dialogForm.dataSelect"
            type="text"
            maxlength="150"
            class="input-default"
            placeholder="权限条件"
          />
        </el-form-item>
        <el-form-item label="备注：" prop="remake">
          <el-input
            v-model.trim="dialogForm.remake"
            type="textarea"
:rows="6"
            maxlength="500"
            show-word-limit
            class="input-default"
            placeholder="备注"
          />
        </el-form-item>
      </el-row>
    </el-form>
  
    <template slot="footer" >
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
    <lookup :multiple="false" :show="lookupShow" @close="lookupClose" />
  </myDialog>
</template>

<script>
import { detail, edit, add } from "@/api/system/dataPower";
import { Message } from "element-ui";
import lookup from "./lookup.vue";
export default {
  components: { lookup },
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
      lookupShow: false,
      loading: false,
      dialogForm: {
        appId: null,
        appName: null, // 应用名称
        dataCode: null, // 权限编码
        dataSelect: null, // 权限条件
        dataTitle: null, // 权限标题
        remake: null, // 备注
      },
      formRules: {
        appName: [
          { required: true, message: "请选择应用名称！", trigger: "change" },
        ],
        dataCode: [
          { required: true, message: "请输入权限编码！", trigger: "blur" },
        ],
        dataSelect: [
          { required: true, message: "请输入权限条件！", trigger: "blur" },
        ],
        dataTitle: [
          { required: true, message: "请输入权限标题！", trigger: "blur" },
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
      detail({ id: this.id })
        .then((res) => {
          that.loading = false;
          that.dialogForm = res;
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
    /**
     * 企业查找带回
     */
    lookupClose(data) {
      this.lookupShow = false;
      console.log(data);
      if (data != null) {
        this.dialogForm.appId = null;
        data.forEach((item) => {
          console.log(item);
          if (!this.dialogForm.appId) {
            this.dialogForm.appId = item.id;
            this.dialogForm.appName = item.appName;
          } else {
            this.dialogForm.appId = item.id;
            this.dialogForm.appName = item.appName;
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.input-default textarea {
  height: 44vh;
}
.input-default{
  width: 400px !important;
}
</style>
