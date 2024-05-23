<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="400px">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="制度分类名称：" prop="ismName">
            <el-input
              v-model="dialogForm.ismName"
              type="text"
              placeholder="请输入制度分类名称"
              clearable
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template slot="footer">
      <myButton type="cancel" @click.native="cancel">取 消</myButton>
      <myButton :loading="loading" @click.native="submit('dialogForm')">
        提 交
      </myButton>
    </template>
  </myDrawer>
</template>

<script>

import {  detail, edit ,add} from "@/api/security/ism";
export default {
  props: {
    title: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      required: true,
      default() {
        return false;
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
      baseURL: process.env.VUE_APP_BASE_API,
      loading: false,
      dialogForm: {
      },
      formRules: {
        ismName: [
          {
            required: true,
            message: "请输入规章名称",
            trigger: ["change", "blur"]
          },
          {
            max: 20,
            message: "规章名称长度不能大于20",
            trigger: ["blur", "change"]
          }
        ],
      },
      options: [],
      hideUpload_introduce_before: false,
      loginUser: {},
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    if (this.id) {
      await this.loadData();
    }
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },
   
    //获取详情
    getdetail() {
      detail(this.id).then(res => {
        this.dialogForm = res.data;
      });
    },
    loadData() {
      const that = this;
      that.loading = true;
      detail({ id: that.id })
        .then(res => {
          that.dialogForm = res;
          that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm));
        })
        .finally(() => {
          that.loading = false;
        });
    },
    submit(fromName) {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs[fromName].validate(valid => {
        if (valid) {
          that.loading = true;

          if (that.id) {
            edit(that.dialogForm)
              .then(res => {
                that.loading = false;
                that.$message({
                  type: "success",
                  message: "修改成功"
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
                  message: "添加成功"
                });
                that.$emit("close", { reload: true });
              })
              .catch(() => {
                that.loading = false;
              });
          }
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
/** 输入框、下拉框的宽度 **/
/deep/.el-cascader,
/deep/.el-select,
/deep/.el-input-number,
/deep/.el-date-editor,
/deep/.el-switch,
/deep/.el-input {
  width: 100% !important;
}

/** 问号提示 **/
/deep/.tips {
  font-size: 16px;
  cursor: pointer;
}

/deep/input[type="file"] {
  display: none;
}
/** 上传文件 **/
/deep/ .upload-demo > div:first-of-type {
  display: inline;
}

/deep/.hideUploadBox > .el-upload--picture-card {
  display: none !important;
}
</style>
