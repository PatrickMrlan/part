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
          <myButton size="small" class="download" @click.native="download"
            >下载模板</myButton
          >
          <el-upload
            class="upload-demo"
            action="#"
            accept=".xls,.xlsx"
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
              请下载模板，并且填充数据再进行上传！
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
    
    </el-form>
    <template slot="footer">
        <myButton type="cancel" @click.native="cancel">取 消</myButton>
        <!-- <myButton :loading="loading" @click.native="clickUpload"
                >提 交</myButton
              > -->
      </template>
  </myDialog>
</template>
          
      <script>
import { Message } from "element-ui";
import { fileUpload } from "@/api/upload";
import { upload } from "@/api/security/punish";
export default {
  props: {
    title: {
      type: String,
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
        file: null,
      },
      fileList: [],
      formRules: {},
    };
  },
  created() {
    console.log(this.projectId);
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
      formData.append("type", "punishdr");
      console.log(formData);
      fileUpload(formData)
        .then((res) => {
          if (res) {
            this.dialogForm = res;
            this.dialogForm.entId = this.entId;
            this.dialogForm.targetId = this.targetId;
            upload(this.dialogForm).then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: res.message,
              });
              if (res.url) {
                setTimeout(() => {
                  window.open(this.baseURL + res.url);
                }, 2000);
              }
            });
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.cancel();
          }, 500);
        });
    },

    /**
     * 下载模板
     */
    download() {
      let random = Math.floor(Math.random() * 10000 + 1);
      console.log(random);
      window.open(
        this.baseURL + "/static/templates/行政处罚导入模板.xlsx?id=" + random
      );
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
          