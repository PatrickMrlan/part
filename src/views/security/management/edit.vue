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
          <el-form-item label="制度名称：" prop="institutionName">
            <el-input
              v-model="dialogForm.institutionName"
              type="text"
              placeholder="请输入岗位名称"
              clearable
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否必备：" prop="isEssential">
            <el-select
              v-model="dialogForm.isEssential"
              placeholder="请选择是否必备"
              clearable
              disabled
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发布日期：" prop="releaseDate">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="dialogForm.releaseDate"
              type="date"
              clearable
              placeholder="选择项目结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="制度文件：" prop="sysEntInstitutionFile">
            <el-tooltip
              class="item tips"
              effect="dark"
              content="可上传图片、文档"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <myUpload
              action="#"
              class="upload-demo"
              accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.pdf,.bmp,.webp"
              multiple
              :file-list="files"
              :on-preview="handlePreview"
              :on-remove="handleRemoveImg"
              :http-request="handleUpload"
              :on-change="handleIntroduceUploadHide"
              :before-upload="beforeUploadImg"
              :before-remove="beforeRemove"
              list-type="picture-card"
              :class="{ hideUploadBox: hideUpload_introduce_before }"
            >
              <div class="uploadImg">
                <i slot="default" class="el-icon-plus" />
              </div>
            </myUpload>
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
import { fileUpload } from "@/api/upload";
import { enumList, detail, edit } from "@/api/security/management";
import { add } from "../../../api/security/management";
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
        sysEntInstitutionFile: {}
      },
      formRules: {
        institutionName: [
          {
            required: true,
            message: "请输入制度名称",
            trigger: ["change", "blur"]
          },
          {
            max: 20,
            message: "制度名称长度不能大于20",
            trigger: ["blur", "change"]
          }
        ],
        isEssential: [
          {
            required: true,
            message: "请选择是否必备",
            trigger: ["change", "blur"]
          }
        ],
        releaseDate: [
          {
            required: true,
            message: "请选择发布日期",
            trigger: ["change", "blur"]
          }
        ],
        sysEntInstitutionFile: {
          required: true,
          message: "请上传制度文件"
        }
      },
      options: [],
      hideUpload_introduce_before: false,
      loginUser: {},
      files: []
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    await this.getenumList();
    if (this.id) {
      await this.loadData();
    } else {
      this.dialogForm.isEssential = 0;
    }
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },
    //获取枚举
    getenumList() {
      enumList().then(res => {
        this.options = res.yesOrNoList;
      });
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
          that.dialogForm.releaseDate =
            that.dialogForm.sysEntInstitutionFile.releaseDate;
          that.dialogForm.fileUrl =
            that.dialogForm.sysEntInstitutionFile.fileUrl;
          if (
            that.dialogForm.sysEntInstitutionFile.fileUrl &&
            that.dialogForm.sysEntInstitutionFile.fileName
          ) {
            this.files.push(that.dialogForm.sysEntInstitutionFile);
            this.files.forEach(item => {
              item.url = require("@/assets/img/fileCover.png");
              item.link = that.baseURL + item.fileUrl;
              item.fileName = item.fileName;
              item.fileId = item.fileId;
            });
            this.hideUpload_introduce_before = true;
          }
          that.dialogForm = JSON.parse(JSON.stringify(that.dialogForm));
        })
        .finally(() => {
          that.loading = false;
        });
    },
    submit() {
      const that = this;
      if (that.loading) {
        return;
      }
      that.$refs["dialogForm"].validate(valid => {
        if (valid) {
          that.loading = true;
          that.dialogForm.sysEntInstitutionFile.releaseDate =
            that.dialogForm.releaseDate;

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
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除模板
    handleRemoveImg(file, fileList) {
      this.dialogForm.sysEntInstitutionFile = {};
      this.files = [];
      this.dialogForm.fileUrl = "";
      this.hideUpload_introduce_before = false;
    },
    beforeUploadImg(file) {
      let name = file.name
        .split(".")
        .pop()
        .toUpperCase();
      if (
        name !== "PDF" &&
        name !== "DOCX" &&
        name !== "DOC" &&
        name !== "XLS" &&
        name !== "XLSX" &&
        name !== "JPG" &&
        name !== "JPEG" &&
        name !== "PNG" &&
        name !== "GIF" &&
        name !== "BMP" &&
        name !== "WEBP"
      ) {
        this.$message({
          type: "error",
          message: "不支持上传当前文件！"
        });
        return false;
      }
    },
    handlePreview(file) {
      if (file && file.fileUrl) {
        window.open(file.fileUrl);
      }
    },

    handleIntroduceUploadHide(type, file, fileList) {
      switch (type) {
        case "management_file":
          this.hideUpload_introduce_before = fileList.length >= 1;
          break;
      }
    },
    // 自定义上传
    handleUpload(file, fileList) {
      const that = this;
      that.loading = true;
      const formData = new FormData();
      formData.append("fileType", 4);
      formData.append("file", file.file);
      formData.append("type", "management_file");
      fileUpload(formData)
        .then(res => {
          this.dialogForm.fileUrl = res.fileUrl;
          res.url = require("@/assets/img/fileCover.png");
          res.link = that.baseURL + res.fileUrl;
          res.fileName = res.fileName;
          res.fileId = res.fileId;
          this.dialogForm.sysEntInstitutionFile.fileUrl =
            that.baseURL + res.fileUrl;
          this.dialogForm.sysEntInstitutionFile.fileName = res.fileName;
          that.dialogForm.fileUrl = that.baseURL + res.fileUrl;
          this.files.push(res);
          that.$message({
            type: "success",
            message: "上传成功！"
          });
          this.hideUpload_introduce_before = true;
        })
        .finally(() => {
          that.loading = false;
        });
    }
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
