<template>
  <myDrawer :title="title" :visible="visible" :cancel="cancel" size="600px">
    <el-form
      v-loading="loading"
      style="min-height: 100%"
      ref="dialogForm"
      :model="dialogForm"
      :rules="formRules"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年份：" prop="costYear">
            <el-select
              v-model="dialogForm.costYear"
              placeholder="请选择年份"
              clearable
              filterable
            >
            <el-option v-for="item in enumList.planYearList" 
              :key="item" 
              :label="item" 
              :value="item" 
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划投入（元）：" prop="paLnInvest">
            <el-input-number v-model="dialogForm.paLnInvest" :precision="2" :step="0.1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提取金额（元）：" prop="extractAmount">
            <el-input-number v-model="dialogForm.extractAmount" :precision="2" :step="0.1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际支出（元）：" prop="realityPay">
            <el-input-number v-model="dialogForm.realityPay" :precision="2" :step="0.1" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="达标情况：" prop="complianceStatus">
            <el-select
              v-model="dialogForm.complianceStatus"
              placeholder="请选择达标情况"
              clearable
              filterable
            >
            <el-option v-for="item in enumList.complianceStatusList" 
            :key="item.value" 
            :label="item.key" 
            :value="item.value" 
            />
            </el-select>
          </el-form-item>
        </el-col>
        
        
        <el-col :span="24">
          <el-form-item label="明细文件：" prop="fileId">
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
import { enumList, detail, edit ,add} from "@/api/security/cost";
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
        paLnInvest:0,
        extractAmount:0,
        realityPay:0,
      },
      formRules: {
        costYear: [
          {
            required: true,
            message: "请选择年份",
            trigger: ["change", "blur"]
          },
        ],
        paLnInvest: [
          {
            required: true,
            message: "请输入计划投入",
            trigger: ["change", "blur"]
          }
        ],
        extractAmount: [
          {
            required: true,
            message: "请输入提取金额",
            trigger: ["change", "blur"]
          }
        ],
        realityPay: [
          {
            required: true,
            message: "请输入实际支出",
            trigger: ["change", "blur"]
          }
        ],
        complianceStatus: [
          {
            required: true,
            message: "请选择达标情况",
            trigger: ["change", "blur"]
          }
        ],

      },
      options: [],
      hideUpload_introduce_before: false,
      loginUser: {},
      files: [],
      depList: [], 
      enumList:[],
    };
  },
  async created() {
    this.loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
    await this.getenumList();
    if (this.id) {
      await this.loadData();
    }
  },
  methods: {
    cancel(done) {
      this.$emit("close", {});
    },
    //获取枚举
    getenumList() {
      enumList().then(res => {
        this.enumList = res;
        this.depList= res.sysDepartmentList;
      });
    },
     /**
     * 树状下拉框重构数据
     */
     treeSelectNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
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
          if (
            that.dialogForm.costFile
          ) {
            this.files.push(that.dialogForm.costFile);
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
    beforeRemove(file, fileList) {
      if (file.fileName) {
        return this.$confirm(`确定移除 ${file.fileName}？`);
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    // 移除模板
    handleRemoveImg(file, fileList) {
      this.dialogForm.fileId = "";
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
          that.dialogForm.fileId=res.fileId;
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
