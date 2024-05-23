<template>
  <myDialog
    :title="title"
    width="600px"
    class="dialog-form"
    :visible="true"
    :loading="loading"
    :cancel="cancel"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
      label-width="20px"
    >
      <el-row :gutter="20" class="rows">
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="#"
            accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.pdf,.bmp,.webp"
            :auto-upload="true"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            :on-change="changeUpload"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <myButton size="small">点击上传</myButton>
            <div slot="tip" class="el-upload__tip">
              请确认无误后，再进行上传！
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
    
    </el-form>
    <template slot="footer">
        <myButton type="cancel" @click.native="cancel">取 消</myButton>
      </template>
  </myDialog>
</template>
          
      <script>
import { Message } from "element-ui";
import { fileUpload } from "@/api/upload";
import { upDetailedFile } from "@/api/security/cost";
export default {
  props: {
    title: {
      type: String,
      required: true,
      default() {
        return "";
      },
    },
    id: {
      required: true,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      loading: false,
      baseURL: process.env.VUE_APP_BASE_API,

      dialogForm: {

        sourceId: null,
        fileId: null,
      },
      fileList: [],
      formRules: {},
    };
  },
  created() {
    console.log(this.id);
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制上传 1 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    changeUpload(file) {
      console.log(file);
    },
    beforeUpload(file) {
      console.log(file);
    },
    handleUpload(file) {
      console.log(file);
      const formData = new FormData();
      formData.append("fileType", 4);
      formData.append("file", file.file);
      formData.append("type", "cost_mx");
      console.log(formData);
      fileUpload(formData)
        .then((res) => {
          if (res) {
            this.dialogForm.sourceId = this.id;
            this.dialogForm.fileId = res.fileId;
            console.log(this.dialogForm);
            upDetailedFile(this.dialogForm).then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "上传成功",
              });
            });
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.cancel();
          }, 500);
        });
    },
    cancel(done) {
      this.$emit("close", {});
    },
  },
};
</script>
          
      <style lang="less" scoped>
/deep/.el-upload__input {
  display: none !important;
}
/deep/.hideUploadBox > .el-upload--picture-card {
  display: none;
}
.download {
  position: absolute;
  left: 90px;
}
</style>
          